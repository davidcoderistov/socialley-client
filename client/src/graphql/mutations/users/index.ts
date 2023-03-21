import { gql } from '@apollo/client'


export const FOLLOW_USER = gql`
    mutation followUser($followedUserId: String!) {
        followUser(followedUserId: $followedUserId) {
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
`

export const UNFOLLOW_USER = gql`
    mutation unfollowUser($followedUserId: String!) {
        unfollowUser(followedUserId: $followedUserId) {
            _id
        }
    }
`

export const MARK_USER_AS_SEARCHED = gql`
    mutation markUserAsSearched($searchedUserId: String!) {
        markUserAsSearched(searchedUserId: $searchedUserId) {
            _id
        }
    }
`

export const MARK_USER_AS_UNSEARCHED = gql`
    mutation markUserAsUnsearched($searchedUserId: String!) {
        markUserAsUnsearched(searchedUserId: $searchedUserId) {
            _id
        }
    }
`

export const CLEAR_SEARCH_HISTORY = gql`
    mutation clearSearchHistory {
        clearSearchHistory {
            deletedCount
        }
    }
`