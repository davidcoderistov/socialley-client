import React, { useState, useEffect } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import FollowableUsersModal from '../FollowableUsersModal'
import { GET_FOLLOWERS_FOR_USER } from '../../graphql/queries/users'
import { GetFollowersForUserQueryType } from '../../graphql/types/queries/users'
import { FOLLOW_USER, UNFOLLOW_USER } from '../../graphql/mutations/users'
import followerUsersMutations from '../../apollo/mutations/users/followersForUser'


interface Props {
    open: boolean
    userId: string | null
    onClose: () => void
}

export default function FollowerUsersModal (props: Props) {

    const { enqueueSnackbar } = useSnackbar()

    const [isInitialLoading, setIsInitialLoading] = useState(false)

    const [getFollowerUsers, followerUsers] = useLazyQuery<GetFollowersForUserQueryType>(GET_FOLLOWERS_FOR_USER, {
        notifyOnNetworkStatusChange: true,
    })

    const [followUser] = useMutation(FOLLOW_USER)
    const [unfollowUser] = useMutation(UNFOLLOW_USER)

    const handleFetchMoreUsers = () => {
        if (followerUsers.data) {
            followerUsers.fetchMore({
                variables: {
                    offset: followerUsers.data.getFollowersForUser.data.length,
                    limit: 10,
                },
                updateQuery (existing, { fetchMoreResult }: { fetchMoreResult: GetFollowersForUserQueryType }) {
                    return {
                        ...existing,
                        getFollowingForUser: {
                            ...existing.getFollowersForUser,
                            data: [
                                ...existing.getFollowersForUser.data,
                                ...fetchMoreResult.getFollowersForUser.data,
                            ]
                        }
                    }
                }
            }).catch(console.log)
        }
    }

    const updateFollowerUserFollowingLoadingStatus = (userId: string, isFollowingLoading: boolean) => {
        followerUsers.updateQuery((prevFollowerUsers) => {
            return followerUsersMutations.updateFollowingLoadingStatus({
                followerUsers: prevFollowerUsers,
                userId,
                isFollowingLoading,
            }).followerUsers
        })
    }

    const updateFollowerUserFollowingStatus = (userId: string, following: boolean) => {
        followerUsers.updateQuery((prevFollowerUsers) => {
            return followerUsersMutations.updateFollowingStatus({
                followerUsers: prevFollowerUsers,
                userId,
                following,
            }).followerUsers
        })
    }

    const handleFollowUser = (userId: string) => {
        updateFollowerUserFollowingLoadingStatus(userId, true)
        followUser({
            variables: {
                followedUserId: userId
            }
        }).then(() => {
            updateFollowerUserFollowingStatus(userId, true)
        }).catch(() => {
            updateFollowerUserFollowingLoadingStatus(userId, false)
            enqueueSnackbar('Could not follow user', { variant: 'error' })
        })
    }

    const handleUnfollowUser = (userId: string) => {
        updateFollowerUserFollowingLoadingStatus(userId, true)
        unfollowUser({
            variables: {
                followedUserId: userId
            }
        }).then(() => {
            updateFollowerUserFollowingStatus(userId, false)
        }).catch(() => {
            updateFollowerUserFollowingLoadingStatus(userId, false)
            enqueueSnackbar('Could not unfollow user', { variant: 'error' })
        })
    }

    useEffect(() => {
        if (!followerUsers.called && props.open && props.userId) {
            setIsInitialLoading(true)
            getFollowerUsers({
                variables: {
                    userId: props.userId,
                    offset: 0,
                    limit: 10,
                },
            }).finally(() => setIsInitialLoading(false))
        }
    }, [props.open, props.userId])

    useEffect(() => {
        if (followerUsers.error) {
            enqueueSnackbar('Follower users could not be retrieved', { variant: 'error' })
        }
    }, [followerUsers.error])

    return (
        <FollowableUsersModal
            title='Followers'
            open={props.open}
            onCloseModal={props.onClose}
            users={followerUsers.data?.getFollowersForUser.data.map(followerUser => ({...followerUser, ...followerUser.followableUser, ...followerUser.followableUser.user})) ?? []}
            isInitialLoading={isInitialLoading}
            isMoreLoading={followerUsers.loading}
            hasMoreUsers={followerUsers.data ?
                followerUsers.data.getFollowersForUser.data.length < followerUsers.data.getFollowersForUser.total : false}
            onFetchMoreUsers={handleFetchMoreUsers}
            onFollowUser={handleFollowUser}
            onUnfollowUser={handleUnfollowUser}
            onClickUser={props.onClose} />
    )
}