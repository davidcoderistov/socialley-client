import { useApolloClient } from '@apollo/client'
import { useLoggedInUser } from '../../misc'
import {
    GET_USER_DETAILS,
    GET_FOLLOWING_FOR_USER,
    GET_FOLLOWERS_FOR_USER,
} from '../../../graphql/queries/users'
import {
    GetUserDetailsQueryType,
    GetFollowingForUserQueryType,
    GetFollowersForUserQueryType,
} from '../../../graphql/types/queries/users'
import userDetailsMutations from '../../../apollo/mutations/users/userDetails'
import followingForUserMutations from '../../../apollo/mutations/users/followingForUser'
import followersForUserMutations from '../../../apollo/mutations/users/followersForUser'
import { FollowingUser } from '../../../graphql/types/models'


export function useFollowUpdateUserConnections () {

    const client = useApolloClient()

    const [loggedInUser] = useLoggedInUser()

    return (followingUser: FollowingUser) => {

        client.cache.updateQuery({
            query: GET_USER_DETAILS,
            variables: { userId: loggedInUser._id },
        }, (userDetails: GetUserDetailsQueryType | null) => {
            if (userDetails) {
                return userDetailsMutations.incrementFollowingCount({
                    userDetails
                })
            }
        })

        client.cache.updateQuery({
            query: GET_FOLLOWING_FOR_USER,
            variables: { userId: loggedInUser._id },
        }, (followingUsers: GetFollowingForUserQueryType | null) => {
            if (followingUsers) {
                return followingForUserMutations.addFollowingUser({
                    followingUsers,
                    followingUser
                }).followingUsers
            }
        })

        client.cache.updateQuery({
            query: GET_USER_DETAILS,
            variables: { userId: followingUser.followableUser.user._id },
        }, (userDetails: GetUserDetailsQueryType | null) => {
            if (userDetails) {
                return userDetailsMutations.incrementFollowersCount({
                    userDetails,
                    latestFollower: { _id: loggedInUser._id, username: loggedInUser.username }
                })
            }
        })

        client.cache.updateQuery({
            query: GET_FOLLOWERS_FOR_USER,
            variables: { userId: followingUser.followableUser.user._id },
        }, (followerUsers: GetFollowersForUserQueryType | null) => {
            if (followerUsers) {
                return followersForUserMutations.addFollowerUser({
                    followerUsers,
                    followerUser: {
                        followableUser: {
                            user: loggedInUser,
                            following: true,
                        },
                        isFollowingLoading: false,
                    }
                }).followerUsers
            }
        })
    }
}