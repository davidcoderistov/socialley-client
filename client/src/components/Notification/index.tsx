import React, { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import UserAvatar from '../UserAvatar'
import ImageDisplay from '../ImageDisplay'
import FollowingButton from '../FollowingButton'
import FollowButton from '../FollowButton'
import UnfollowUserModal from '../UnfollowUserModal'
import { getTimeElapsed } from '../../utils'


interface User {
    _id: string
    username: string
    firstName: string
    lastName: string
    avatarURL: string | null
}

interface FollowableUser extends User {
    following: boolean
    isFollowingLoading: boolean
}

interface LoadingNotification {
    isUserLoading: true
    type?: never
    user?: never
    photoURL?: never
    createdAt?: never
    onFollowUser?: never
    onUnfollowUser?: never
}

interface FollowNotification {
    isUserLoading?: never
    type: 'follow'
    user: FollowableUser
    photoURL?: never
    createdAt: number
    onFollowUser: (userId: string, event: React.MouseEvent) => void
    onUnfollowUser: (userId: string) => void
}

interface PostOrCommentNotification {
    isUserLoading?: never
    type: 'post' | 'comment'
    user: User
    photoURL: string
    createdAt: number
    onFollowUser?: never
    onUnfollowUser?: never
}

type Props = LoadingNotification | FollowNotification | PostOrCommentNotification

export default function Notification (props: Props) {

    const [userToUnfollow, setUserToUnfollow] = useState<User | null>(null)

    const ago = useMemo(() => {
        if (!props.isUserLoading) {
            return getTimeElapsed(props.createdAt)
        }
        return ''
    }, [props.isUserLoading, props.createdAt])

    const handleFollowUser = (event: React.MouseEvent) => {
        if (!props.isUserLoading && props.type === 'follow') {
            props.onFollowUser(props.user._id, event)
        }
    }

    const handleUnfollowUser = () => {
        if (!props.isUserLoading && props.type === 'follow') {
            setUserToUnfollow(null)
            props.onUnfollowUser(props.user._id)
        }
    }

    const handleOpenUnfollowUserModal = (event: React.MouseEvent) => {
        if (!props.isUserLoading && props.type === 'follow') {
            event.stopPropagation()
            setUserToUnfollow(props.user)
        }
    }

    const handleCloseUnfollowUserModal = () => setUserToUnfollow(null)

    return (
        <Box
            component='div'
            display='flex'
            flexDirection='row'
            justifyContent='space-between'
            alignItems='center'
            paddingY='5px'
            paddingX='24px'
            columnGap='5px'
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
                { props.isUserLoading ? (
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
                        firstName={props.user.firstName}
                        lastName={props.user.lastName}
                        photoURL={props.user.avatarURL}
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
                    { props.isUserLoading ? (
                        <Skeleton
                            sx={{ backgroundColor: '#262626' }}
                            animation='wave'
                            width='180px'
                            height='19px' />
                    ) : (
                        <Typography
                            color='#FFFFFF'
                            fontSize={14}
                            sx={{ whiteSpace: 'normal' }}
                        >
                            { props.user.username } <span style={{ color: '#DCDCDC' }}>
                                { props.type === 'follow' && 'started following you.' }
                                { props.type === 'post' && 'liked your photo.' }
                                { props.type === 'comment' && 'left a comment.' }
                            </span> <span style={{ color: '#A8A8A8' }}>
                                { ago }
                            </span>
                        </Typography>
                    )}
                </Box>
            </Box>
            { !props.isUserLoading ? props.type === 'follow' ? props.user.following ? (
                <FollowingButton
                    contained={false}
                    loading={props.user.isFollowingLoading}
                    onClick={handleOpenUnfollowUserModal} />
            ): (
                <FollowButton
                    contained={false}
                    loading={props.user.isFollowingLoading}
                    onClick={handleFollowUser} />
            ): (
                <Box
                    component='div'
                    flex='0 0 44px'
                    height='44px'
                >
                    <ImageDisplay url={props.photoURL} minHeight={0} />
                </Box>
            ): null }
            { userToUnfollow && (
                <UnfollowUserModal
                    open={true}
                    stopPropagation={true}
                    user={userToUnfollow}
                    onUnfollowUser={handleUnfollowUser}
                    onCloseModal={handleCloseUnfollowUserModal} />
            )}
        </Box>
    )
}