import React from 'react'
import Box, { BoxProps } from '@mui/material/Box'
import { useQuery } from '@apollo/client'
import { GET_IMAGE } from '../../graphql/queries/files'
import { ImageQueryData } from '../../graphql/types'


interface ImageProps extends BoxProps {
    url: string
    showAlways: boolean
}

export default function Image ({ url, showAlways, ... props }: ImageProps) {

    const { data } = useQuery<ImageQueryData>(GET_IMAGE, {
        variables: {
            url
        }
    })

    return showAlways || data?.getImage ? (
        <Box
            {...props}
            component='img'
            src={`data:image/jpeg;base64,${data?.getImage}`}
        />
    ) : null
}

