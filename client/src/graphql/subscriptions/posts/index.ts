import { gql } from '@apollo/client'


export const POST_LIKED_SUBSCRIPTION = gql`
    subscription postLiked {
        postLiked {
            _id
            user {
                _id
                firstName
                lastName
                username
                avatarURL
            }
            post {
                _id
                photoURL
            }
            createdAt
        }
    }
`

export const POST_COMMENTED_SUBSCRIPTION = gql`
    subscription postCommented {
        postCommented {
            _id
            user {
                _id
                firstName
                lastName
                username
                avatarURL
            }
            post {
                _id
                photoURL
            }
            createdAt
        }
    }
`