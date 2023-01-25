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