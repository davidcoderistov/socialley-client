import React from 'react'
import { useLoggedInUser } from '../../hooks/misc'
import { Box, Typography, Skeleton } from '@mui/material'
import UserAvatar from '../UserAvatar'
import FollowButton from '../FollowButton'
import FollowingButton from '../FollowingButton'


interface User {
    _id: string
    username: string
    firstName: string
    lastName: string
    avatarURL: string | null
    following: boolean
    isFollowingLoading: boolean
}

interface LoadingState {
    isUserLoading: true
    user?: never
    onFollowUser?: never
    onUnfollowUser?: never
}

interface UserState {
    isUserLoading?: never
    user: User
    onFollowUser: (userId: string) => void
    onUnfollowUser: (userId: string) => void
}

type Props = LoadingState | UserState

export default function UserListItem ({ user, isUserLoading, onFollowUser, onUnfollowUser }: Props) {

    const [loggedInUser] = useLoggedInUser()

    const handleFollowUser = () => {
        if (!isUserLoading && user) {
            onFollowUser(user._id)
        }
    }

    const handleUnfollowUser = () => {
        if (!isUserLoading && user) {
            onUnfollowUser(user._id)
        }
    }

    return (
        <Box
            component='div'
            display='flex'
            flexDirection='row'
            justifyContent='space-between'
            alignItems='center'
            paddingX='15px'
            paddingY='10px'
        >
            <Box
                component='div'
                display='flex'
                flexDirection='row'
                justifyContent='flex-start'
                alignItems='center'
                columnGap='10px'
                minWidth={0}
            >
                { isUserLoading ? (
                    <Box
                        component='div'
                        width='52px'
                    >
                        <Skeleton
                            component='div'
                            animation='wave'
                            variant='circular'
                            width='44px'
                            height='44px'
                            sx={{ backgroundColor: '#000000' }} />
                    </Box>
                ) : (
                    <UserAvatar
                        firstName={user.firstName}
                        lastName={user.lastName}
                        size={44}
                        backgroundColor='#616161' />
                )}
                <Box
                    component='div'
                    display='flex'
                    flexDirection='column'
                    justifyContent='center'
                    minWidth={0}
                >
                    { isUserLoading ? (
                        <Skeleton sx={{ backgroundColor: '#000000' }} animation='wave' width='180px' />
                    ) : (
                        <Typography
                            variant='body1'
                            color='#FFFFFF'
                            noWrap
                        >
                            { user.username }
                        </Typography>
                    )}
                    { isUserLoading ? (
                        <Skeleton sx={{ backgroundColor: '#000000' }} animation='wave' width='120px' />
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
            { !isUserLoading && user && user._id !== loggedInUser._id ? user.following ? (
                <FollowingButton
                    contained={true}
                    loading={user.isFollowingLoading}
                    onClick={handleUnfollowUser} />
            ) : (
                <FollowButton
                    contained={true}
                    loading={user.isFollowingLoading}
                    onClick={handleFollowUser} />
            ) : null }
        </Box>
    )
}