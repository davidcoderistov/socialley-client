import { useApolloClient, useLazyQuery } from '@apollo/client'
import { GET_LATEST_CHAT_MESSAGES } from '../../../graphql/queries/messages'
import { GetLatestChatMessagesQueryType } from '../../../graphql/types/queries/messages'
import { Message } from '../../../graphql/types/models'

export function useLatestChatMessages ({ limit }: { limit: number }) {

    const client = useApolloClient()

    const [queryChatMessages, { fetchMore }] = useLazyQuery(GET_LATEST_CHAT_MESSAGES)

    const loadChatMessages = (userId: string) => {
        queryChatMessages({
            variables: {
                userId,
                limit,
                offset: 0,
            }
        }).catch(console.log)
    }

    const fetchMoreChatMessages = (userId: string, offset: number) => {
        fetchMore({
            variables: {
                userId,
                offset
            },
            updateQuery (existing: GetLatestChatMessagesQueryType, { fetchMoreResult}: { fetchMoreResult: GetLatestChatMessagesQueryType }) {
                return {
                    ...existing,
                    getLatestChatMessages: {
                        ...existing.getLatestChatMessages,
                        data: [
                            ...existing.getLatestChatMessages.data,
                            ...fetchMoreResult.getLatestChatMessages.data.map(message => ({ ...message, temporary: false }))
                        ]
                    }
                }
            }
        }).catch(console.log)
    }

    const getChatMessages = (userId: string): { chatMessages: Message[], chatMessagesCount: number, chatMessagesOffset: number } | null => {
        const queryData: { getLatestChatMessages: { data: Message[], total: number }} | null = client.cache.readQuery({
            query: GET_LATEST_CHAT_MESSAGES,
            variables: { userId },
        })
        if (queryData) {
            return {
                chatMessages: queryData?.getLatestChatMessages?.data ?? [],
                chatMessagesCount: queryData?.getLatestChatMessages?.total ?? 0,
                chatMessagesOffset: queryData?.getLatestChatMessages?.data.filter(message => !message.temporary).length ?? 0
            }
        }
        return null
    }

    return [
        loadChatMessages,
        fetchMoreChatMessages,
        getChatMessages,
    ] as const
}