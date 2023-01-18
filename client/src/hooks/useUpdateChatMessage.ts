import { useApolloClient } from '@apollo/client'
import { GET_LATEST_CHAT_MESSAGES } from '../graphql/queries/messages'
import { Message } from '../types'


export function useUpdateChatMessage () {

    const client = useApolloClient()

    const updateChatMessage = (userId: string, messageId: string, updateMessage: Message) => {
        client.cache.updateQuery({
            query: GET_LATEST_CHAT_MESSAGES,
            variables: { userId },
        }, (queryData) => {
            const messages: Message[] | undefined = queryData?.getLatestChatMessages?.data
            if (Array.isArray(messages)) {
                return {
                    ...queryData,
                    getLatestChatMessages: {
                        ...queryData.getLatestChatMessages,
                        data: messages.map(message => {
                            if (message._id === messageId) {
                                return updateMessage
                            }
                            return message
                        })
                    }
                }
            }
        })
    }

    return [updateChatMessage] as const
}