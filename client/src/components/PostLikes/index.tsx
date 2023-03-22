import React, { useState, useMemo, useEffect } from 'react'
import Box from '@mui/material/Box'
import FollowableUsersModal from '../FollowableUsersModal'
import { useSnackbar } from 'notistack'
import { useLazyQuery } from '@apollo/client'
import { useFollowUser } from '../../hooks/graphql/users'
import { GET_USERS_WHO_LIKED_POST } from '../../graphql/queries/posts'
import { GetUsersWhoLikedPostQueryType } from '../../graphql/types/queries/posts'
import { useMutation } from '@apollo/client'
import { UNFOLLOW_USER } from '../../graphql/mutations/users'
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

    const [offset, setOffset] = useState(0)
    const [isUserLikesModalOpen, setIsUserLikesModalOpen] = useState(false)
    const [isInitialLoading, setIsInitialLoading] = useState(false)

    const [getUsersWhoLikedPost, usersWhoLikedPost] = useLazyQuery<GetUsersWhoLikedPostQueryType>(GET_USERS_WHO_LIKED_POST)

    const followUser = useFollowUser()
    const [unfollowUser] = useMutation(UNFOLLOW_USER)

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
            }).finally(() => {
                setOffset(10)
                setIsInitialLoading(false)
            })
        }
    }

    const handleFetchMoreUsers = () => {
        usersWhoLikedPost.fetchMore({
            variables: {
                offset,
                limit: 10,
            },
            updateQuery (existing, { fetchMoreResult }: { fetchMoreResult: GetUsersWhoLikedPostQueryType }) {
                return {
                    ...existing,
                    getUsersWhoLikedPost: {
                        ...existing.getUsersWhoLikedPost,
                        data: [
                            ...existing.getUsersWhoLikedPost.data,
                            ...fetchMoreResult.getUsersWhoLikedPost.data,
                        ]
                    }
                }
            }
        }).then(() => setOffset(offset + 10))
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
        followUser(userId, {
            onStart () {
                updatePostQueryFollowingLoadingStatus(userId, true)
            },
            onSuccess () {
                updatePostQueryFollowingStatus(userId, true)
            },
            onError () {
                updatePostQueryFollowingLoadingStatus(userId, false)
            }
        })
    }

    const handleUnfollowUser = (userId: string) => {
        updatePostQueryFollowingLoadingStatus(userId, true)
        unfollowUser({
            variables: {
                followedUserId: userId
            }
        }).then(() => {
            updatePostQueryFollowingStatus(userId, false)
        }).catch(() => {
            updatePostQueryFollowingLoadingStatus(userId, false)
            enqueueSnackbar('Could not unfollow user', { variant: 'error' })
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
                            onClick={handleViewLikingUsers}
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
            <FollowableUsersModal
                title='Likes'
                open={isUserLikesModalOpen}
                onCloseModal={handleCloseUserLikesModal}
                users={usersWhoLikedPost.data?.getUsersWhoLikedPost.data.map(userWhoLikedPost => ({...userWhoLikedPost, ...userWhoLikedPost.followableUser, ...userWhoLikedPost.followableUser.user})) ?? []}
                isInitialLoading={isInitialLoading}
                isMoreLoading={usersWhoLikedPost.loading}
                hasMoreUsers={usersWhoLikedPost.data ?
                    offset < usersWhoLikedPost.data.getUsersWhoLikedPost.total : false}
                onFetchMoreUsers={handleFetchMoreUsers}
                onFollowUser={handleFollowUser}
                onUnfollowUser={handleUnfollowUser}
                onClickUser={handleCloseUserLikesModal} />
        </>
    )
}