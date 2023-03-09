import React, { useMemo } from 'react'
import Avatar from '@mui/material/Avatar'
import { getInitial } from '../../utils'


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

export default function UserAvatar ({ firstName, lastName, size = 56, fontSize, backgroundColor = '#2C3539', clickable = false, onClick }: Props) {

    const firstInitial = useMemo(() => getInitial(firstName), [firstName])
    const secondInitial = useMemo(() => getInitial(lastName), [lastName])

    const handleClick = () => {
        if (clickable && onClick) {
            onClick()
        }
    }

    return (
        <Avatar sx={{ width: size, height: size, backgroundColor, ...fontSize && { fontSize }, ...clickable && { cursor: 'pointer' }}} onClick={handleClick}>
            {firstInitial}{secondInitial}
        </Avatar>
    )
}

