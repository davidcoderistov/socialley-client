import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useFollowUpdateUserConnections } from '../../hooks/graphql/users'
import { useSnackbar } from 'notistack'
import FollowableUsersModal from '../FollowableUsersModal'
import { GET_FOLLOWING_FOR_USER } from '../../graphql/queries/users'
import { GetFollowingForUserQueryType } from '../../graphql/types/queries/users'
import { FOLLOW_USER, UNFOLLOW_USER } from '../../graphql/mutations/users'
import { FollowUserMutationType } from '../../graphql/types/mutations/users'
import followingUsersMutations from '../../apollo/mutations/users/followingForUser'


interface Props {
    open: boolean
    userId: string | null
    onClose: () => void
}

export default function FollowingUsersModal (props: Props) {

    const { enqueueSnackbar } = useSnackbar()

    const [offset, setOffset] = useState(10)
    const [isLoadingMore, setIsLoadingMore] = useState(false)

    const followingUsers = useQuery<GetFollowingForUserQueryType>(GET_FOLLOWING_FOR_USER, {
        variables: { userId: props.userId, offset: 0, limit: 10 },
        skip: !props.open || !props.userId,
    })

    const [followUser] = useMutation<FollowUserMutationType>(FOLLOW_USER)
    const [unfollowUser] = useMutation(UNFOLLOW_USER)
    const updateFollowUserConnections = useFollowUpdateUserConnections()

    const handleFetchMoreUsers = () => {
        setIsLoadingMore(true)
        followingUsers.fetchMore({
            variables: {
                offset,
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
        })
            .then(() => setOffset(offset + 10))
            .catch(console.log)
            .finally(() => setIsLoadingMore(false))
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
        updateFollowingUserFollowingLoadingStatus(userId, true)
        followUser({
            variables: {
                followedUserId: userId
            }
        }).then(follow => {
            updateFollowingUserFollowingStatus(userId, true)
            const followedUser = follow.data?.followUser
            if (followedUser) {
                updateFollowUserConnections({
                    followableUser: followedUser,
                    isFollowingLoading: false,
                })
            }
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
        }).catch(() => {
            updateFollowingUserFollowingLoadingStatus(userId, false)
            enqueueSnackbar('Could not unfollow user', { variant: 'error' })
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
                offset < followingUsers.data.getFollowingForUser.total : false}
            onFetchMoreUsers={handleFetchMoreUsers}
            onFollowUser={handleFollowUser}
            onUnfollowUser={handleUnfollowUser}
            onClickUser={props.onClose} />
    )
}