import { useApolloClient } from '@apollo/client'
import { useContext } from 'react'
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
import { QueryTrackerContext } from '../../../providers/QueryTrackerProvider'


export function useUnfollowUpdateUserConnections () {

    const client = useApolloClient()

    const { untrackQuery } = useContext(QueryTrackerContext)

    const [loggedInUser] = useLoggedInUser()

    return (userId: string) => {

        client.cache.updateQuery({
            query: GET_USER_DETAILS,
            variables: { userId: loggedInUser._id },
        }, (userDetails: GetUserDetailsQueryType | null) => {
            if (userDetails) {
                return userDetailsMutations.decrementFollowingCount({
                    userDetails
                })
            }
        })

        client.cache.updateQuery({
            query: GET_FOLLOWING_FOR_USER,
            variables: { userId: loggedInUser._id },
        }, (followingUsers: GetFollowingForUserQueryType | null) => {
            if (followingUsers) {
                const updateQuery = followingForUserMutations.removeFollowingUser({
                    followingUsers,
                    userId,
                })
                if (!updateQuery.success) {
                    client.cache.evict({ fieldName: 'getFollowingForUser', args: { userId: loggedInUser._id }})
                    untrackQuery('getFollowingForUser', { name: 'userId', value: loggedInUser._id })
                } else {
                    return updateQuery.followingUsers
                }
            }
        })

        client.cache.updateQuery({
            query: GET_USER_DETAILS,
            variables: { userId },
        }, (userDetails: GetUserDetailsQueryType | null) => {
            if (userDetails) {
                return userDetailsMutations.decrementFollowersCount({
                    userDetails,
                })
            }
        })

        client.cache.updateQuery({
            query: GET_FOLLOWERS_FOR_USER,
            variables: { userId },
        }, (followerUsers: GetFollowersForUserQueryType | null) => {
            if (followerUsers) {
                const updateQuery = followersForUserMutations.removeFollowerUser({
                    followerUsers,
                    userId: loggedInUser._id,
                })
                if (!updateQuery.success) {
                    client.cache.evict({ fieldName: 'getFollowersForUser', args: { userId }})
                    untrackQuery('getFollowersForUser', { name: 'userId', value: userId })
                } else {
                    return updateQuery.followerUsers
                }
            }
        })
    }
}