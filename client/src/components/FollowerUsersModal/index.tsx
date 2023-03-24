import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { useFollowUser, useUnfollowUser } from '../../hooks/graphql/users'
import { useSnackbar } from 'notistack'
import { useFetchMore } from '../../hooks/misc'
import FollowableUsersModal from '../FollowableUsersModal'
import { GET_FOLLOWERS_FOR_USER } from '../../graphql/queries/users'
import { GetFollowersForUserQueryType } from '../../graphql/types/queries/users'
import followerUsersMutations from '../../apollo/mutations/users/followersForUser'


interface Props {
    open: boolean
    userId: string | null
    onClose: () => void
}

export default function FollowerUsersModal (props: Props) {

    const { enqueueSnackbar } = useSnackbar()

    const [isLoadingMore, setIsLoadingMore] = useState(false)

    const followerUsers = useQuery<GetFollowersForUserQueryType>(GET_FOLLOWERS_FOR_USER, {
        variables: { userId: props.userId, offset: 0, limit: 10 },
        skip: !props.open || !props.userId,
    })

    const fetchMoreFollowerUsers = useFetchMore<GetFollowersForUserQueryType>({
        queryName: 'getFollowersForUser',
        queryResult: followerUsers,
        updateQuery (existing, incoming) {
            return {
                ...existing,
                getFollowersForUser: {
                    ...existing.getFollowersForUser,
                    data: [
                        ...existing.getFollowersForUser.data,
                        ...incoming.getFollowersForUser.data,
                    ]
                }
            }
        }
    })

    const followUser = useFollowUser()
    const unfollowUser = useUnfollowUser()

    const handleFetchMoreUsers = () => {
        if (followerUsers.data) {
            fetchMoreFollowerUsers({
                variables: {
                    offset: followerUsers.data.getFollowersForUser.data.length,
                    limit: 10,
                },
                onStart () {
                    setIsLoadingMore(true)
                },
                onFinally () {
                    setIsLoadingMore(false)
                }
            })
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
        followUser(userId, {
            onStart () {
                updateFollowerUserFollowingLoadingStatus(userId, true)
            },
            onSuccess () {
                updateFollowerUserFollowingStatus(userId, true)
            },
            onError () {
                updateFollowerUserFollowingLoadingStatus(userId, false)
            }
        })
    }

    const handleUnfollowUser = (userId: string) => {
        unfollowUser(userId, {
            onStart () {
                updateFollowerUserFollowingLoadingStatus(userId, true)
            },
            onSuccess () {
                updateFollowerUserFollowingStatus(userId, false)
            },
            onError () {
                updateFollowerUserFollowingLoadingStatus(userId, false)
            }
        })
    }

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
            isInitialLoading={followerUsers.loading}
            isMoreLoading={isLoadingMore}
            hasMoreUsers={followerUsers.data ?
                followerUsers.data.getFollowersForUser.data.length < followerUsers.data.getFollowersForUser.total : false}
            onFetchMoreUsers={handleFetchMoreUsers}
            onFollowUser={handleFollowUser}
            onUnfollowUser={handleUnfollowUser}
            onClickUser={props.onClose} />
    )
}