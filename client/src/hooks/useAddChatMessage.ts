import { useApolloClient } from '@apollo/client'
import { GET_LATEST_CHAT_MESSAGES } from '../graphql/queries/messages'
import { v4 as uuid } from 'uuid'
import moment from 'moment'


interface Message {
    fromUserId: string
    toUserId: string
    message?: string | null
    photoURL?: string | null
}

export function useAddChatMessage () {

    const client = useApolloClient()

    const addChatMessage = (userId: string, { fromUserId, toUserId, message = null, photoURL = null }: Message): string | null => {
        let _id = null
        client.cache.updateQuery({
            query: GET_LATEST_CHAT_MESSAGES,
            variables: { userId }
        }, (queryData) => {
            const messages = queryData?.getLatestChatMessages?.data
            if (Array.isArray(messages)) {
                _id = uuid()
                return {
                    ...queryData,
                    getLatestChatMessages: {
                        ...queryData.getLatestChatMessages,
                        data: [{
                            _id,
                            fromUserId,
                            toUserId,
                            message,
                            photoURL,
                            createdAt: moment().unix(),
                        }, ...messages]
                    }
                }
            }
        })
        return _id
    }

    return [addChatMessage] as const
}