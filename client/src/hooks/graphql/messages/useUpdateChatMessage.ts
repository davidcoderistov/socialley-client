import { useApolloClient } from '@apollo/client'
import { GET_LATEST_CHAT_MESSAGES } from '../../../graphql/queries/messages'
import { LatestChatMessagesQueryData } from '../../../graphql/types'
import { Message } from '../../../types'


export function useUpdateChatMessage () {

    const client = useApolloClient()

    const updateChatMessage = ({ userId, messageId } : { userId: string, messageId: string }, updateMessage: Message): boolean => {
        let success = false
        client.cache.updateQuery({
            query: GET_LATEST_CHAT_MESSAGES,
            variables: { userId }
        }, (queryData: LatestChatMessagesQueryData | null) => {
            if (queryData) {
                return {
                    ...queryData,
                    getLatestChatMessages: {
                        ...queryData.getLatestChatMessages,
                        data: queryData.getLatestChatMessages.data.map(message => {
                            if (message._id === messageId) {
                                success = true
                                return updateMessage
                            }
                            return message
                        }),
                        total: queryData.getLatestChatMessages.total + 1,
                    }
                }
            }
        })
        return success
    }

    return [updateChatMessage] as const
}