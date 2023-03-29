import { gql } from '@apollo/client'


export const CREATE_MESSAGE = gql`
    mutation createMessage($message: CreateMessageInput) {
        createMessage(message: $message) {
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