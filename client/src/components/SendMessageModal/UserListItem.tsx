import React from 'react'
import { Box, Typography, Skeleton } from '@mui/material'
import UserAvatar from '../UserAvatar'


interface User {
    _id: string
    username: string
    firstName: string
    lastName: string
    avatarURL?: string | null
}

interface LoadingState {
    loading: true
    user?: never
    onClick?: never
}

interface UserState {
    loading?: never
    user: User
    onClick: (user: User) => void
}

type Props = LoadingState | UserState

export default function UserListItem ({ user, onClick, loading }: Props) {

    const handleClick = () => {
        if (user) {
            onClick(user)
        }
    }

    return (
        <Box
            component='div'
            display='flex'
            flexDirection='row'
            justifyContent='flex-start'
            alignItems='center'
            columnGap='10px'
            sx={{
                paddingY: '7px',
                paddingX: '15px',
                ...!loading && {
                    '&:hover': {
                        backgroundColor: '#000000'
                    },
                    cursor: 'pointer'
                }
            }}
            onClick={handleClick}
        >
            { loading ? (
                <Box
                    component='div'
                    width='56px'
                >
                    <Skeleton
                        component='div'
                        animation='wave'
                        variant='circular'
                        width='48px'
                        height='48px'
                        sx={{ backgroundColor: '#2C3539' }} />
                </Box>
            ) : (
                <UserAvatar
                    firstName={user.firstName}
                    lastName={user.lastName}
                    photoURL={user?.avatarURL}
                    size={48} />
            )}
            <Box
                component='div'
                display='flex'
                flexDirection='column'
                justifyContent='center'
                minWidth={0}
            >
                { loading ? (
                    <Skeleton sx={{ backgroundColor: '#2C3539' }} animation='wave' width='180px' />
                ) : (
                    <Typography
                        variant='body1'
                        color='#FFFFFF'
                        noWrap
                    >
                        { user.username }
                    </Typography>
                )}
                { loading ? (
                    <Skeleton sx={{ backgroundColor: '#2C3539' }} animation='wave' width='120px' />
                ) : (
                    <Typography
                        variant='body2'
                        color='#8E8E8E'
                        noWrap
                    >
                        { user.firstName } { user.lastName }
                    </Typography>
                )}
            </Box>
        </Box>
    )
}