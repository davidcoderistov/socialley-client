import { gql } from '@apollo/client'


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

export const GET_FOLLOWING_FOR_USER = gql`
    query getFollowingForUser ($userId: String!, $offset: Int!, $limit: Int!) {
        getFollowingForUser (userId: $userId, offset: $offset, limit: $limit) {
            data {
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
            }
            total
        }
    }
`

export const GET_FOLLOWERS_FOR_USER = gql`
    query getFollowersForUser ($userId: String!, $offset: Int!, $limit: Int!) {
        getFollowersForUser (userId: $userId, offset: $offset, limit: $limit) {
            data {
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
            }
            total
        }
    }
`