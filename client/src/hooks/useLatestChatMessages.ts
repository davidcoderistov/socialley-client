import { useApolloClient, useLazyQuery } from '@apollo/client'
import { GET_LATEST_CHAT_MESSAGES } from '../graphql/queries/messages'


export interface Message {
    _id: string
    fromUserId: string
    toUserId: string
    message: string
    photoURL: string
    createdAt: number
}

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
            }
        }).catch(console.log)
    }

    const getChatMessages = (userId: string): { chatMessages: Message[], chatMessagesCount: number } | null => {
        const queryData: { getLatestChatMessages: { data: Message[], total: number }} | null = client.cache.readQuery({
            query: GET_LATEST_CHAT_MESSAGES,
            variables: { userId },
        })
        if (queryData) {
            return {
                chatMessages: queryData?.getLatestChatMessages?.data ?? [],
                chatMessagesCount: queryData?.getLatestChatMessages?.total ?? 0,
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