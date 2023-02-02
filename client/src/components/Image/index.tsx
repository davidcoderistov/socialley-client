import React from 'react'
import Box, { BoxProps } from '@mui/material/Box'
import { useQuery } from '@apollo/client'
import { GET_IMAGE } from '../../graphql/queries/files'
import { ImageQueryData } from '../../graphql/types'


interface ImageProps extends BoxProps {
    url: string
}

export default function Image ({ url, ... props }: ImageProps) {

    const { data } = useQuery<ImageQueryData>(GET_IMAGE, {
        variables: {
            url
        }
    })

    return (
        <Box
            {...props}
            component='img'
            src={`data:image/jpeg;base64,${data?.getImage}`}
        />
    )
}

