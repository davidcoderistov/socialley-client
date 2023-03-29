import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { Close } from '@mui/icons-material'
import Skeleton from '@mui/material/Skeleton'
import UserAvatar from '../UserAvatar'


interface User {
    _id: string
    username: string
    firstName: string
    lastName: string
    avatarURL: string | null
}

interface LoadingStateProps {
    isUserLoading: true
    user?: never
    onClickUser?: never
    onRemoveUser?: never
}

interface UserStateProps {
    isUserLoading?: never
    user: User
    onClickUser: (userId: string) => void
    onRemoveUser: (userId: string) => void
}

type Props = UserStateProps | LoadingStateProps

export default function SearchHistoryUser ({ user, isUserLoading, onClickUser, onRemoveUser }: Props) {

    const handleClickUser = () => {
        if (!isUserLoading && user) {
            onClickUser(user._id)
        }
    }

    const handleRemoveUser = (event: React.MouseEvent) => {
        if (!isUserLoading && user) {
            event.stopPropagation()
            onRemoveUser(user._id)
        }
    }

    return (
        <Box
            component='div'
            display='flex'
            flexDirection='row'
            justifyContent='space-between'
            alignItems='center'
            paddingY='5px'
            paddingX='24px'
            sx={{ ...!isUserLoading && { cursor: 'pointer', '&:hover': { backgroundColor: '#121212' }}}}
            onClick={handleClickUser}
        >
            <Box
                component='div'
                display='flex'
                flexDirection='row'
                justifyContent='flex-start'
                alignItems='center'
                columnGap='10px'
                minWidth={0}
                width='100%'
            >
                { isUserLoading ? (
                    <Box
                        component='div'
                        width='44px'
                    >
                        <Skeleton
                            component='div'
                            animation='wave'
                            variant='circular'
                            width='36px'
                            height='36px'
                            sx={{ backgroundColor: '#262626' }} />
                    </Box>
                ) : (
                    <UserAvatar
                        firstName={user.firstName}
                        lastName={user.lastName}
                        photoURL={user?.avatarURL}
                        size={36}
                        fontSize={14}
                        clickable={false}
                        backgroundColor='#262626' />
                )}
                <Box
                    component='div'
                    display='flex'
                    flexDirection='column'
                    justifyContent='center'
                    minWidth={0}
                >
                    { isUserLoading ? (
                        <Skeleton
                            sx={{ backgroundColor: '#262626' }}
                            animation='wave'
                            width='180px'
                            height='19px' />
                    ) : (
                        <Typography
                            color='#FFFFFF'
                            fontSize={14}
                            noWrap
                        >
                            { user.username }
                        </Typography>
                    )}
                    { isUserLoading ? (
                        <Skeleton
                            sx={{ backgroundColor: '#262626' }}
                            animation='wave'
                            width='120px'
                            height='17px' />
                    ) : (
                        <Typography
                            color='#8E8E8E'
                            fontSize={14}
                            noWrap
                        >
                            { user.firstName } { user.lastName }
                        </Typography>
                    )}
                </Box>
            </Box>
            { !isUserLoading && (
                <IconButton onClick={handleRemoveUser}>
                    <Close sx={{ color: '#A8A8A8'}} />
                </IconButton>
            )}
        </Box>
    )
}
