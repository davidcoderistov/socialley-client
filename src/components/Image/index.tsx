import React, { useState, useEffect, useMemo } from 'react'
import Box, { BoxProps } from '@mui/material/Box'
import { useLazyQuery } from '@apollo/client'
import { GET_IMAGE } from '../../graphql/queries/files'
import { GetImageQueryType } from '../../graphql/types/queries/files'


interface Props extends BoxProps {
    url: string
    remote: boolean
}

export default function Image ({url, remote, ...boxProps}: Props) {

    const [fetchImage, data] = useLazyQuery<GetImageQueryType>(GET_IMAGE, {
        variables: {
            url
        }
    })
    const [loading, setLoading] = useState(false)

    const imgUrl = useMemo(() => {
        if (remote && !data.loading && data.data?.getImage) {
            return `data:image/jpeg;base64,${data.data.getImage}`
        }
        if (!remote && !loading) {
            return url
        }
        return null
    }, [remote, data, loading])

    useEffect(() => {
        setLoading(true)
        if (remote) {
            fetchImage()
        } else {
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
    }, [url])

    return imgUrl ? (
        <Box
            component='img'
            src={imgUrl}
            {...boxProps} />
    ) : null
}