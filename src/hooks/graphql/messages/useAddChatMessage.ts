import { useApolloClient } from '@apollo/client'
import { GET_LATEST_CHAT_MESSAGES } from '../../../graphql/queries/messages'
import { GetLatestChatMessagesQueryType } from '../../../graphql/types/queries/messages'
import { Message } from '../../../graphql/types/models'


export function useAddChatMessage () {

    const client = useApolloClient()

    const addChatMessage = (userId: string, message: Message, updateMessageId: string | null = null) => {
        client.cache.updateQuery({
            query: GET_LATEST_CHAT_MESSAGES,
            variables: { userId },
        }, (queryData: GetLatestChatMessagesQueryType | null) => {
            if (queryData) {
                const findIndex = queryData.getLatestChatMessages.data.findIndex(m => m._id === updateMessageId)
                if (findIndex > -1) {
                    const newMessages = Array.from(queryData.getLatestChatMessages.data)
                    newMessages[findIndex] = {...message}
                    return {
                        ...queryData,
                        getLatestChatMessages: {
                            ...queryData.getLatestChatMessages,
                            data: newMessages,
                            total: queryData.getLatestChatMessages.total + 1,
                        }
                    }
                } else {
                    return {
                        ...queryData,
                        getLatestChatMessages: {
                            ...queryData.getLatestChatMessages,
                            data: [message, ...queryData.getLatestChatMessages.data],
                            total: message.temporary ?
                                queryData.getLatestChatMessages.total :
                                queryData.getLatestChatMessages.total + 1,
                        }
                    }
                }
            }
        })
    }

    return [addChatMessage] as const
}