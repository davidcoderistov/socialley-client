import React, { useState, useMemo, useEffect } from 'react'
import Box from '@mui/material/Box'
import UserLikesModal from '../UserLikesModal'
import { useSnackbar } from 'notistack'
import { useLazyQuery } from '@apollo/client'
import { GET_USERS_WHO_LIKED_POST } from '../../graphql/queries/posts'
import { useMutation } from '@apollo/client'
import { FOLLOW_USER, UNFOLLOW_USER } from '../../graphql/mutations/users'
import { UsersWhoLikedPostQueryData, UnfollowUserMutationData } from '../../graphql/types'
import { updateFollowingLoadingStatus, toggleFollowingStatus } from '../../apollo/mutations/posts/usersWhoLikedPost'


interface Props {
    postId: string
    user: {
        _id: string
        username: string
    }
    likesCount: number
}

export default function PostLikes (props: Props) {

    const { enqueueSnackbar } = useSnackbar()

    const [isUserLikesModalOpen, setIsUserLikesModalOpen] = useState(false)
    const [isInitialLoading, setIsInitialLoading] = useState(false)

    const [getUsersWhoLikedPost, usersWhoLikedPost] = useLazyQuery<UsersWhoLikedPostQueryData>(GET_USERS_WHO_LIKED_POST)

    const [followUser] = useMutation(FOLLOW_USER)
    const [unfollowUser] = useMutation<UnfollowUserMutationData>(UNFOLLOW_USER)

    const handleViewLikingUsers = () => {
        setIsUserLikesModalOpen(true)
        if (!usersWhoLikedPost.called) {
            setIsInitialLoading(true)
            getUsersWhoLikedPost({
                variables: {
                    postId: props.postId,
                    offset: 0,
                    limit: 10,
                }
            }).finally(() => setIsInitialLoading(false))
        }
    }

    const handleFetchMoreUsers = () => {
        if (usersWhoLikedPost.data) {
            usersWhoLikedPost.fetchMore({
                variables: {
                    offset: usersWhoLikedPost.data.getUsersWhoLikedPost.data.length,
                    limit: 10,
                }
            })
        }
    }

    const updateQueryFollowingLoadingStatus = (userId: string, isFollowingLoading: boolean) => {
        usersWhoLikedPost.updateQuery((prevUsersWhoLikedPost) => {
            return updateFollowingLoadingStatus({
                usersWhoLikedPost: prevUsersWhoLikedPost,
                userId,
                isFollowingLoading,
            }).usersWhoLikedPost
        })
    }

    const updateQueryToggleFollowingStatus = (userId: string) => {
        usersWhoLikedPost.updateQuery((prevUsersWhoLikedPost) => {
            return toggleFollowingStatus({
                usersWhoLikedPost: prevUsersWhoLikedPost,
                userId,
            }).usersWhoLikedPost
        })
    }

    const handleFollowUser = (userId: string) => {
        updateQueryFollowingLoadingStatus(userId, true)
        followUser({
            variables: {
                followedUserId: userId
            }
        }).then(() => {
            updateQueryToggleFollowingStatus(userId)
        }).catch(() => {
            updateQueryFollowingLoadingStatus(userId, false)
            enqueueSnackbar('Could not follow user', { variant: 'error' })
        })
    }

    const handleUnfollowUser = (userId: string) => {
        updateQueryFollowingLoadingStatus(userId, true)

        const showErrorAndToggleFollowingLoadingStatus = () => {
            updateQueryFollowingLoadingStatus(userId, false)
            enqueueSnackbar('Could not unfollow user', { variant: 'error' })
        }

        unfollowUser({
            variables: {
                followedUserId: userId
            }
        }).then((data) => {
            if (data.data?.unfollowUser) {
                updateQueryToggleFollowingStatus(userId)
            } else {
                showErrorAndToggleFollowingLoadingStatus()
            }
        }).catch(() => {
            showErrorAndToggleFollowingLoadingStatus()
        })
    }

    useEffect(() => {
        if (usersWhoLikedPost.error) {
            enqueueSnackbar('Post likes could not be retrieved', { variant: 'error' })
        }
    }, [usersWhoLikedPost.error])

    const handleCloseUserLikesModal = () => setIsUserLikesModalOpen(false)

    const othersCount = useMemo(() => props.likesCount - 1, [props.likesCount])

    return (
        <>
            <Box
                component='div'
                minHeight='0'
                minWidth='0'
                justifyContent='flex-start'
                flexDirection='row'
                alignItems='stretch'
                alignContent='stretch'
                display='flex'
                boxSizing='border-box'
                position='relative'
            >
                <Box
                    component='div'
                    margin='auto'
                    flexWrap='wrap'
                    flex='1 1 auto'
                    minHeight='0'
                    minWidth='0'
                    justifyContent='flex-start'
                    flexDirection='column'
                    alignItems='stretch'
                    alignContent='stretch'
                    display='flex'
                    boxSizing='border-box'
                    position='relative'
                >
                    <Box
                        component='div'
                        display='block'
                        color='#FFFFFF'
                        margin='0'
                        fontWeight='400'
                        fontSize='14px'
                        lineHeight='18px'
                    >
                        <Box
                            component='span'
                        >
                            Liked by
                        </Box>&nbsp;
                        <Box
                            component='span'
                            fontWeight='600'
                            sx={{ cursor: 'pointer' }}
                        >
                            { props.user.username }
                        </Box>&nbsp;
                        { othersCount > 0 && (
                            <>
                                <Box
                                    component='span'
                                >
                                    and
                                </Box>&nbsp;
                                <Box
                                    component='span'
                                    fontWeight='bold'
                                    sx={{ cursor: 'pointer' }}
                                    onClick={handleViewLikingUsers}
                                >
                                    { `${othersCount} other${othersCount > 1 ? 's' : ''}`}
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>
            </Box>
            <UserLikesModal
                open={isUserLikesModalOpen}
                onCloseModal={handleCloseUserLikesModal}
                users={usersWhoLikedPost.data?.getUsersWhoLikedPost.data ?? []}
                isInitialLoading={isInitialLoading}
                isMoreLoading={usersWhoLikedPost.loading}
                hasMoreUsers={usersWhoLikedPost.data ?
                    usersWhoLikedPost.data.getUsersWhoLikedPost.data.length < usersWhoLikedPost.data.getUsersWhoLikedPost.total : false}
                onFetchMoreUsers={handleFetchMoreUsers}
                onFollowUser={handleFollowUser}
                onUnfollowUser={handleUnfollowUser} />
        </>
    )
}