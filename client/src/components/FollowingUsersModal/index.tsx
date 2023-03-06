import React, { useState, useEffect } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useRemoveFollowedUserPost } from '../../hooks/graphql/posts'
import { useSnackbar } from 'notistack'
import FollowableUsersModal from '../FollowableUsersModal'
import { GET_FOLLOWING_FOR_USER } from '../../graphql/queries/users'
import { GetFollowingForUserQueryType } from '../../graphql/types/queries/users'
import { FOLLOW_USER, UNFOLLOW_USER } from '../../graphql/mutations/users'
import followingUsersMutations from '../../apollo/mutations/users/followingForUser'


interface Props {
    open: boolean
    userId: string | null
    onClose: () => void
}

export default function FollowingUsersModal (props: Props) {

    const { enqueueSnackbar } = useSnackbar()

    const [isInitialLoading, setIsInitialLoading] = useState(false)

    const [getFollowingUsers, followingUsers] = useLazyQuery<GetFollowingForUserQueryType>(GET_FOLLOWING_FOR_USER, {
        notifyOnNetworkStatusChange: true,
    })

    const [followUser] = useMutation(FOLLOW_USER)
    const [unfollowUser] = useMutation(UNFOLLOW_USER)

    const handleFetchMoreUsers = () => {
        if (followingUsers.data) {
            followingUsers.fetchMore({
                variables: {
                    offset: followingUsers.data.getFollowingForUser.data.length,
                    limit: 10,
                },
                updateQuery (existing, { fetchMoreResult }: { fetchMoreResult: GetFollowingForUserQueryType }) {
                    return {
                        ...existing,
                        getFollowingForUser: {
                            ...existing.getFollowingForUser,
                            data: [
                                ...existing.getFollowingForUser.data,
                                ...fetchMoreResult.getFollowingForUser.data,
                            ]
                        }
                    }
                }
            }).catch(console.log)
        }
    }

    const updateFollowingUserFollowingLoadingStatus = (userId: string, isFollowingLoading: boolean) => {
        followingUsers.updateQuery((prevFollowingUsers) => {
            return followingUsersMutations.updateFollowingLoadingStatus({
                followingUsers: prevFollowingUsers,
                userId,
                isFollowingLoading,
            }).followingUsers
        })
    }

    const updateFollowingUserFollowingStatus = (userId: string, following: boolean) => {
        followingUsers.updateQuery((prevFollowingUsers) => {
            return followingUsersMutations.updateFollowingStatus({
                followingUsers: prevFollowingUsers,
                userId,
                following,
            }).followingUsers
        })
    }

    const removeFollowedUserPost = useRemoveFollowedUserPost()

    const handleFollowUser = (userId: string) => {
        updateFollowingUserFollowingLoadingStatus(userId, true)
        followUser({
            variables: {
                followedUserId: userId
            }
        }).then(() => {
            updateFollowingUserFollowingStatus(userId, true)
        }).catch(() => {
            updateFollowingUserFollowingLoadingStatus(userId, false)
            enqueueSnackbar('Could not follow user', { variant: 'error' })
        })
    }

    const handleUnfollowUser = (userId: string) => {
        updateFollowingUserFollowingLoadingStatus(userId, true)
        unfollowUser({
            variables: {
                followedUserId: userId
            }
        }).then(() => {
            updateFollowingUserFollowingStatus(userId, false)
            removeFollowedUserPost(userId)
        }).catch(() => {
            updateFollowingUserFollowingLoadingStatus(userId, false)
            enqueueSnackbar('Could not unfollow user', { variant: 'error' })
        })
    }

    useEffect(() => {
        if (!followingUsers.called && props.open && props.userId) {
            setIsInitialLoading(true)
            getFollowingUsers({
                variables: {
                    userId: props.userId,
                    offset: 0,
                    limit: 10,
                },
            }).finally(() => setIsInitialLoading(false))
        }
    }, [props.open, props.userId])

    useEffect(() => {
        if (followingUsers.error) {
            enqueueSnackbar('Following users could not be retrieved', { variant: 'error' })
        }
    }, [followingUsers.error])

    return (
        <FollowableUsersModal
            title='Following'
            open={props.open}
            onCloseModal={props.onClose}
            users={followingUsers.data?.getFollowingForUser.data.map(followingUser => ({...followingUser, ...followingUser.followableUser, ...followingUser.followableUser.user})) ?? []}
            isInitialLoading={isInitialLoading}
            isMoreLoading={followingUsers.loading}
            hasMoreUsers={followingUsers.data ?
                followingUsers.data.getFollowingForUser.data.length < followingUsers.data.getFollowingForUser.total : false}
            onFetchMoreUsers={handleFetchMoreUsers}
            onFollowUser={handleFollowUser}
            onUnfollowUser={handleUnfollowUser} />
    )
}