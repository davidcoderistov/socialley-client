import React, { useState, useMemo, useEffect } from 'react'
import Box from '@mui/material/Box'
import UserLikesModal from '../UserLikesModal'
import { useSnackbar } from 'notistack'
import { useLazyQuery } from '@apollo/client'
import { GET_USERS_WHO_LIKED_POST, GetUsersWhoLikedPostQueryType } from '../../graphql/queries/posts'
import { useMutation } from '@apollo/client'
import { FOLLOW_USER, UNFOLLOW_USER } from '../../graphql/mutations/users'
import { UnfollowUserMutationData } from '../../graphql/types'
import usersWhoLikedPostMutations from '../../apollo/mutations/posts/usersWhoLikedPost'


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

    const [getUsersWhoLikedPost, usersWhoLikedPost] = useLazyQuery<GetUsersWhoLikedPostQueryType>(GET_USERS_WHO_LIKED_POST)

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

    const updatePostQueryFollowingLoadingStatus = (userId: string, isFollowingLoading: boolean) => {
        usersWhoLikedPost.updateQuery((prevUsersWhoLikedPost) => {
            return usersWhoLikedPostMutations.updateFollowingLoadingStatus({
                usersWhoLikedPost: prevUsersWhoLikedPost,
                userId,
                isFollowingLoading,
            }).usersWhoLikedPost
        })
    }

    const updatePostQueryFollowingStatus = (userId: string, following: boolean) => {
        usersWhoLikedPost.updateQuery((prevUsersWhoLikedPost) => {
            return usersWhoLikedPostMutations.updateFollowingStatus({
                usersWhoLikedPost: prevUsersWhoLikedPost,
                userId,
                following,
            }).usersWhoLikedPost
        })
    }

    const handleFollowUser = (userId: string) => {
        updatePostQueryFollowingLoadingStatus(userId, true)
        followUser({
            variables: {
                followedUserId: userId
            }
        }).then(() => {
            updatePostQueryFollowingStatus(userId, true)
        }).catch(() => {
            updatePostQueryFollowingLoadingStatus(userId, false)
            enqueueSnackbar('Could not follow user', { variant: 'error' })
        })
    }

    const handleUnfollowUser = (userId: string) => {
        updatePostQueryFollowingLoadingStatus(userId, true)

        const showErrorAndToggleFollowingLoadingStatus = () => {
            updatePostQueryFollowingLoadingStatus(userId, false)
            enqueueSnackbar('Could not unfollow user', { variant: 'error' })
        }

        unfollowUser({
            variables: {
                followedUserId: userId
            }
        }).then((data) => {
            if (data.data?.unfollowUser) {
                updatePostQueryFollowingStatus(userId, false)
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
                users={usersWhoLikedPost.data?.getUsersWhoLikedPost.data.map(userWhoLikedPost => ({...userWhoLikedPost, ...userWhoLikedPost.followableUser, ...userWhoLikedPost.followableUser.user})) ?? []}
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