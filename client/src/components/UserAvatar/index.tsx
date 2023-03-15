import React, { useMemo } from 'react'
import Avatar from '@mui/material/Avatar'
import ImageDisplay from '../ImageDisplay'
import { getInitial } from '../../utils'
import Box from "@mui/material/Box";


interface Props {
    firstName: string
    lastName: string
    photoURL?: string | null
    size?: number
    fontSize?: number
    backgroundColor?: string
    clickable?: boolean
    onClick?: () => void
}

export default function UserAvatar ({ firstName, lastName, photoURL, size = 56, fontSize, backgroundColor = '#2C3539', clickable = false, onClick }: Props) {

    const firstInitial = useMemo(() => getInitial(firstName), [firstName])
    const secondInitial = useMemo(() => getInitial(lastName), [lastName])

    const handleClick = () => {
        if (clickable && onClick) {
            onClick()
        }
    }

    return photoURL ? (
        <Box
            component='div'
            flex={`0 0 ${size}px`}
            height={`${size}px`}
        >
            <ImageDisplay
                url={photoURL}
                rounded
                aspectRatioPercentage={100}
                minHeight={0} />
        </Box>
    ): (
        <Avatar sx={{ width: size, height: size, backgroundColor, ...fontSize && { fontSize }, ...clickable && { cursor: 'pointer' }}} onClick={handleClick}>
            {firstInitial}{secondInitial}
        </Avatar>
    )
}

