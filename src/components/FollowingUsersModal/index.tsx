import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { useFetchMore } from '../../hooks/misc'
import { useFollowUser, useUnfollowUser } from '../../hooks/graphql/users'
import { useSnackbar } from 'notistack'
import FollowableUsersModal from '../FollowableUsersModal'
import { GET_FOLLOWING_FOR_USER } from '../../graphql/queries/users'
import { GetFollowingForUserQueryType } from '../../graphql/types/queries/users'
import followingUsersMutations from '../../apollo/mutations/users/followingForUser'


interface Props {
    open: boolean
    userId: string | null
    onClose: () => void
}

export default function FollowingUsersModal (props: Props) {

    const { enqueueSnackbar } = useSnackbar()

    const [isLoadingMore, setIsLoadingMore] = useState(false)

    const followingUsers = useQuery<GetFollowingForUserQueryType>(GET_FOLLOWING_FOR_USER, {
        variables: { userId: props.userId, offset: 0, limit: 10 },
        skip: !props.open || !props.userId,
    })

    const fetchMoreFollowingUsers = useFetchMore<GetFollowingForUserQueryType>({
        queryName: 'getFollowingForUser',
        queryResult: followingUsers,
        updateQuery (existing, incoming) {
            return {
                ...existing,
                getFollowingForUser: {
                    ...existing.getFollowingForUser,
                    data: [
                        ...existing.getFollowingForUser.data,
                        ...incoming.getFollowingForUser.data,
                    ]
                }
            }
        }
    })

    const followUser = useFollowUser()
    const unfollowUser = useUnfollowUser()

    const handleFetchMoreUsers = () => {
        if (followingUsers.data) {
            const userId = props.userId as string
            fetchMoreFollowingUsers({
                variables: {
                    offset: followingUsers.data.getFollowingForUser.data.length,
                    limit: 10,
                },
                keyVariables: {
                    userId
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

    const handleFollowUser = (userId: string) => {
        followUser(userId, {
            onStart () {
                updateFollowingUserFollowingLoadingStatus(userId, true)
            },
            onSuccess () {
                updateFollowingUserFollowingStatus(userId, true)
            },
            onError () {
                updateFollowingUserFollowingLoadingStatus(userId, false)
            }
        })
    }

    const handleUnfollowUser = (userId: string) => {
        unfollowUser(userId, {
            onStart () {
                updateFollowingUserFollowingLoadingStatus(userId, true)
            },
            onSuccess () {
                updateFollowingUserFollowingStatus(userId, false)
            },
            onError () {
                updateFollowingUserFollowingLoadingStatus(userId, false)
            }
        })
    }

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
            isInitialLoading={followingUsers.loading}
            isMoreLoading={isLoadingMore}
            hasMoreUsers={followingUsers.data ?
                followingUsers.data.getFollowingForUser.data.length < followingUsers.data.getFollowingForUser.total : false}
            onFetchMoreUsers={handleFetchMoreUsers}
            onFollowUser={handleFollowUser}
            onUnfollowUser={handleUnfollowUser}
            onClickUser={props.onClose} />
    )
}