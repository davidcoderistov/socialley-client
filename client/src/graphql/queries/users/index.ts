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
    query getSuggestedUsers ($offset: Int!, $limit: Int!) {
        getSuggestedUsers (offset: $offset, limit: $limit) {
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
                latestFollower {
                    _id
                    username
                }
                followedCount
                isFollowingLoading @client
            }
            total
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
                isFollowingLoading @client
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
                isFollowingLoading @client
            }
            total
        }
    }
`

export const GET_USER_DETAILS = gql`
    query getUserDetails ($userId: String!) {
        getUserDetails (userId: $userId) {
            followableUser {
                user {
                    _id
                    firstName
                    lastName
                    avatarURL
                    username
                }
                following
            }
            postsCount
            followingCount
            followersCount
            latestFollower {
                _id
                username
            }
            followedCount
        }
    }
`

export const GET_SEARCHED_USERS = gql`
    query getSearchedUsers ($searchQuery: String!) {
        getSearchedUsers (searchQuery: $searchQuery) {
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
            isFollowingLoading @client
        }
    }
`