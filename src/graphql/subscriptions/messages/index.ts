import { gql } from '@apollo/client'


export const MESSAGE_CREATED_SUBSCRIPTION = gql`
    subscription messageCreated {
        messageCreated {
            _id
            fromUser {
                _id
                firstName
                lastName
                avatarURL
            }
            toUser {
                _id
                firstName
                lastName
                avatarURL
            }
            message
            photoURL
            createdAt
        }
    }
`