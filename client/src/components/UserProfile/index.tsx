import React, { useMemo } from 'react'
import { useApolloClient, useQuery, useMutation } from '@apollo/client'
import { useFollowUser } from '../../hooks/graphql/users'
import { useSnackbar } from 'notistack'
import { GET_USER_DETAILS } from '../../graphql/queries/users'
import { GetUserDetailsQueryType } from '../../graphql/types/queries/users'
import { UNFOLLOW_USER } from '../../graphql/mutations/users'
import Box from '@mui/material/Box'
import UserProfileDetails from '../UserProfileDetails'
import UserPostsFeed from '../UserPostsFeed'
import userDetailsMutations from '../../apollo/mutations/users/userDetails'


interface UserProfileProps {
    userId: string
}

export default function UserProfile (props: UserProfileProps) {

    const client = useApolloClient()

    const { enqueueSnackbar } = useSnackbar()

    const userDetails = useQuery<GetUserDetailsQueryType>(GET_USER_DETAILS, { variables: { userId: props.userId }})

    const user = useMemo(() => {
        return userDetails.data?.getUserDetails ?? null
    }, [userDetails.data])

    const followUser = useFollowUser()
    const [unfollowUser] = useMutation(UNFOLLOW_USER)

    const updateFollowingLoadingStatus = (userId: string, isFollowingLoading: boolean) => {
        client.cache.updateQuery({
            query: GET_USER_DETAILS,
            variables: { userId },
        }, (userDetails: GetUserDetailsQueryType | null) => {
            if (userDetails) {
                return userDetailsMutations.updateFollowingLoadingStatus({
                    userDetails,
                    isFollowingLoading,
                })
            }
        })
    }

    const updateFollowingStatus = (userId: string, following: boolean) => {
        client.cache.updateQuery({
            query: GET_USER_DETAILS,
            variables: { userId },
        }, (userDetails: GetUserDetailsQueryType | null) => {
            if (userDetails) {
                return userDetailsMutations.updateFollowingStatus({
                    userDetails,
                    following,
                })
            }
        })
    }

    const handleFollowUser = (userId: string) => {
        followUser(userId, {
            onStart () {
                updateFollowingLoadingStatus(userId, true)
            },
            onSuccess () {
                updateFollowingStatus(userId, true)
            },
            onError () {
                updateFollowingLoadingStatus(userId, false)
            }
        })
    }

    const handleUnfollowUser = (userId: string) => {
        updateFollowingLoadingStatus(userId, true)
        unfollowUser({
            variables: {
                followedUserId: userId
            }
        }).then(() => {
            updateFollowingStatus(userId, false)
        }).catch(() => {
            updateFollowingLoadingStatus(userId, false)
            enqueueSnackbar('Could not unfollow user', { variant: 'error' })
        })
    }

    return (
        <Box
            component='div'
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            width='100%'
        >
            <Box
                component='div'
                width='75%'
            >
                { userDetails.loading ? (
                    <UserProfileDetails loading={true} />
                ) : user ? (
                    <UserProfileDetails
                        isLoggedInUserProfile={false}
                        _id={user.followableUser.user._id}
                        username={user.followableUser.user.username}
                        firstName={user.followableUser.user.firstName}
                        lastName={user.followableUser.user.lastName}
                        avatarURL={user.followableUser.user.avatarURL}
                        postsCount={user.postsCount}
                        followersCount={user.followersCount}
                        followingCount={user.followingCount}
                        following={user.followableUser.following}
                        isFollowingLoading={user.isFollowingLoading}
                        latestMutualFollower={user.latestFollower}
                        mutualFollowersCount={user.followedCount}
                        onFollowUser={handleFollowUser}
                        onUnfollowUser={handleUnfollowUser} />
                ) : null }
            </Box>
            <Box
                component='div'
                padding='0'
                margin='0'
                boxSizing='border-box'
                position='relative'
                borderTop='1px solid #262626'
                width='75%'
            >
                <UserPostsFeed
                    userId={props.userId}
                    boxProps={{ marginBottom: '40px', marginTop: '20px' }}
                    dense />
            </Box>
        </Box>
    )
}