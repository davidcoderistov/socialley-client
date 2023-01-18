import { gql } from '@apollo/client'


export const CREATE_MESSAGE = gql`
    mutation createMessage($message: CreateMessageInput) {
        createMessage(message: $message) {
            _id
            fromUserId
            toUserId
            message
            photoURL
            createdAt
        }
    }
`