import React, { useState, useEffect, useMemo } from 'react'
import Box, { BoxProps } from '@mui/material/Box'


interface Props extends BoxProps {
    url: string
    remote: boolean
}

export default function Image ({url, remote, ...boxProps}: Props) {

    const [loading, setLoading] = useState(false)

    const imgUrl = useMemo(() => {
        if (loading) {
            return null
        }
        return url.trim().length > 0 ? url : null
    }, [url, loading])

    useEffect(() => {
        if (remote) {
            fetchImage()
        } else {
            setLoading(true)
            const image = new window.Image()
            image.src = url
            image.addEventListener('load', () => {
                setLoading(false)
            })
            image.addEventListener('error', () => {
                setLoading(false)
            })

            return () => {
                image.removeEventListener('load', () => {})
                image.removeEventListener('error', () => {})
            }
        }
    }, [url, remote])

    const fetchImage = () => {
        setLoading(true)
        fetch(url).finally(() => setLoading(false))
    }

    return imgUrl ? (
        <Box
            component='img'
            src={imgUrl}
            {...boxProps} />
    ) : null
}