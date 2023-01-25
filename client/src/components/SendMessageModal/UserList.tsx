import React from 'react'
import { Box, Typography } from '@mui/material'
import UserListItem from './UserListItem'
import _range from 'lodash/range'


interface User {
    _id: string
    username: string
    firstName: string
    lastName: string
    avatarURL?: string | null
}

interface Props {
    loading: boolean
    users: User[]
    onClick: (user: User) => void
}

export default function UserList({ users, onClick, loading }: Props) {

    return (
        <Box
            component='div'
        >
            { loading ? (
                _range(5).map(index => (
                    <UserListItem
                        key={index}
                        loading />
                ))
            ) : users.length > 0 ? (
                users.map(user => (
                    <UserListItem
                        key={user._id}
                        user={user}
                        onClick={onClick} />
                ))
            ) : (
                <Box
                    component='div'
                    paddingX='15px'
                    paddingTop='10px'
                    display='flex'
                    flexDirection='row'
                    justifyContent='center'
                >
                    <Typography variant='body2' color='#8E8E8E'>
                        No account found.
                    </Typography>
                </Box>
            )}
        </Box>
    )
}