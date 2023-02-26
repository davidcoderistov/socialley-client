import { gql } from '@apollo/client'
import { User, FollowableUser } from '../../types/user'


export interface GetUsersBySearchQueryQueryType {
    getUsersBySearchQuery: Omit<User, 'email'>[]
}

export const GET_USERS_BY_SEARCH_QUERY = gql`
    query getUsersBySearchQuery($searchQuery: String!, $limit: Int!) {
        getUsersBySearchQuery(searchQuery: $searchQuery, limit: $limit) {
            _id
            firstName
            lastName
            username
            avatarURL
        }
    }
`

export interface SuggestedUser {
    followableUser: FollowableUser
    latestFollower: Pick<User, '_id' | 'username'> | null
    followedCount: number
    isFollowingLoading: boolean
}

export interface GetSuggestedUsersQueryType {
    getSuggestedUsers: SuggestedUser[]
}

export const GET_SUGGESTED_USERS = gql`
    query getSuggestedUsers {
        getSuggestedUsers {
            followableUser {
                user {
                    _id
                    firstName
                    lastName
                    username
                    avatarURL
                }
                following
            }
            latestFollower {
                _id
                username
            }
            followedCount
            isFollowingLoading @client
        }
    }
`