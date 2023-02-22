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
            _id
            firstName
            lastName
            username
            avatarURL
            latestFollower {
                _id
                username
            }
            followedCount
        }
    }
`