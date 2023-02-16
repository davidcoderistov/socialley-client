import { gql } from '@apollo/client'


export const FOLLOW_USER = gql`
    mutation followUser($followedUserId: String!) {
        followUser(followedUserId: $followedUserId) {
            _id
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