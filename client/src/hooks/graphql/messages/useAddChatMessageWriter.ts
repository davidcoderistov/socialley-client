import { useApolloClient } from '@apollo/client'
import { GET_LATEST_CHAT_MESSAGES } from '../../../graphql/queries/messages'
import { LatestChatMessagesQueryData } from '../../../graphql/types'
import { Message } from '../../../types'
import { v4 as uuid } from 'uuid'
import moment from 'moment'


interface AddMessage {
    fromUserId: string
    toUserId: string
    message?: string | null
    photoURL?: string | null
}

export function useAddChatMessageWriter () {

    const client = useApolloClient()

    const addChatMessage = (userId: string, { fromUserId, toUserId, message = null, photoURL = null }: AddMessage): Message | null => {
        let newMessage = null
        client.cache.updateQuery({
            query: GET_LATEST_CHAT_MESSAGES,
            variables: { userId },
        }, (queryData: LatestChatMessagesQueryData | null) => {
            if (queryData) {
                newMessage = {
                    _id: uuid(),
                    fromUserId: fromUserId,
                    toUserId: toUserId,
                    message: message,
                    photoURL: photoURL,
                    createdAt: moment().unix(),
                }
                return {
                    ...queryData,
                    getLatestChatMessages: {
                        ...queryData.getLatestChatMessages,
                        data: [newMessage, ...queryData.getLatestChatMessages.data]
                    }
                }
            }
        })
        return newMessage
    }

    return [addChatMessage] as const
}