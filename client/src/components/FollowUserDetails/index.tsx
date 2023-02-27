import React from 'react'
import { useLoggedInUser } from '../../hooks/misc'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
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
    latestFollower?: { _id: string, username: string } | null
    followedCount?: number
}

interface LoadingStateProps {
    isUserLoading: true
    dense?: boolean
    dark?: boolean
    user?: never
    onFollowUser?: never
    onUnfollowUser?: never
}

interface UserStateProps {
    isUserLoading?: never
    dense?: boolean
    dark?: boolean
    user: User
    onFollowUser: (userId: string) => void
    onUnfollowUser: (userId: string) => void
}

type Props = UserStateProps | LoadingStateProps

export default function FollowUserDetails ({ user, dense = false, dark = false, isUserLoading, onFollowUser, onUnfollowUser }: Props) {

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

    const loadingBackgroundColor = dark ? '#000000' : '#262626'

    return (
        <Box
            component='div'
            display='flex'
            flexDirection='row'
            justifyContent='space-between'
            alignItems='center'
            paddingX={dense ? 0 : '15px'}
            paddingY={dense ? '5px' : '10px'}
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
                        width={dense ? '44px' : '52px'}
                    >
                        <Skeleton
                            component='div'
                            animation='wave'
                            variant='circular'
                            width={dense ? '36px' : '44px'}
                            height={dense ? '36px' : '44px'}
                            sx={{ backgroundColor: loadingBackgroundColor }} />
                    </Box>
                ) : (
                    <UserAvatar
                        firstName={user.firstName}
                        lastName={user.lastName}
                        size={dense ? 36 : 44}
                        fontSize={dense ? 14 : 16}
                        backgroundColor={dark ? '#616161' : '#262626'} />
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
                            sx={{ backgroundColor: loadingBackgroundColor }}
                            animation='wave'
                            width='180px'
                            {...dense && { height: '19px' }} />
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
                            sx={{ backgroundColor: loadingBackgroundColor }}
                            animation='wave'
                            width='120px'
                            {...dense && { height: '17px' }} />
                    ) : !dense ? (
                        <Typography
                            color='#8E8E8E'
                            fontSize={14}
                            noWrap
                        >
                            { user.firstName } { user.lastName }
                        </Typography>
                    ) : null }
                    { !!user && (
                        <Typography
                            color='#8E8E8E'
                            fontSize={12}
                            noWrap
                        >
                            { !!user.followedCount && user.followedCount > 0 && user.latestFollower ? (
                                <>
                                    Followed by { user.latestFollower.username }
                                    { user.followedCount > 1 && ` + ${user.followedCount - 1} more`}
                                </>
                            ) : 'No mutual followers' }
                        </Typography>
                    )}
                </Box>
            </Box>
            { !isUserLoading && user && user._id !== loggedInUser._id ? user.following ? (
                <FollowingButton
                    contained={!dense}
                    loading={user.isFollowingLoading}
                    onClick={handleUnfollowUser} />
            ) : (
                <FollowButton
                    contained={!dense}
                    loading={user.isFollowingLoading}
                    onClick={handleFollowUser} />
            ) : null }
        </Box>
    )
}
