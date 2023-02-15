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
}

export default function UserAvatar ({ firstName, lastName, size = 56, fontSize, backgroundColor = '#2C3539' }: Props) {

    const firstInitial = useMemo(() => getInitial(firstName), [firstName])
    const secondInitial = useMemo(() => getInitial(lastName), [lastName])

    return (
        <Avatar sx={{ width: size, height: size, backgroundColor, ...fontSize && { fontSize }}}>
            {firstInitial}{secondInitial}
        </Avatar>
    )
}

