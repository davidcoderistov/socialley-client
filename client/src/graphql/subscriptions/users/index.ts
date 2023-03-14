import { gql } from '@apollo/client'


export const USER_FOLLOWED_SUBSCRIPTION = gql`
    subscription userFollowed {
        userFollowed {
            _id
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
            createdAt
            isFollowingLoading @client
        }
    }
`