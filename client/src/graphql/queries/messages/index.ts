import { gql } from '@apollo/client'


export const GET_LATEST_MESSAGE = gql`
    query getLatestMessage($userId: String!) {
        getLatestMessage(userId: $userId) {
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

export const GET_LATEST_MESSAGES = gql`
    query getLatestMessages($offset: Int!, $limit: Int!) {
        getLatestMessages(offset: $offset, limit: $limit) {
            total
            data {
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
    }    
`

export const GET_LATEST_CHAT_MESSAGES = gql`
    query getLatestChatMessages($userId: String!, $offset: Int!, $limit: Int!) {
        getLatestChatMessages(userId: $userId, offset: $offset, limit: $limit) {
            total
            data {
                _id
                fromUserId
                toUserId
                message
                photoURL
                createdAt
            }
        }
    }
`