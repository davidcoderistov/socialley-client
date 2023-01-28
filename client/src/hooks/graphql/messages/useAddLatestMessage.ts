import { useApolloClient } from '@apollo/client'
import { useLoggedInUser } from '../../misc'
import { GET_LATEST_MESSAGES } from '../../../graphql/queries/messages'
import { LatestMessagesQueryData } from '../../../graphql/types'
import { FullMessage } from '../../../types'


export function useAddLatestMessage () {

    const client = useApolloClient()

    const [loggedInUser] = useLoggedInUser()

    const addLatestMessage = (message: FullMessage) => {
        client.cache.updateQuery({
            query: GET_LATEST_MESSAGES,
        }, (queryData: LatestMessagesQueryData | null) => {
            if (queryData) {
                const userId = message.fromUser._id === loggedInUser._id ? message.toUser._id : message.fromUser._id
                const findIndex = queryData.getLatestMessages.data.findIndex(latestMessage =>
                    (latestMessage.fromUser._id === loggedInUser._id && latestMessage.toUser._id === userId) ||
                    (latestMessage.toUser._id === loggedInUser._id && latestMessage.fromUser._id === userId))
                if (findIndex > -1) {
                    const newMessages = Array.from(queryData.getLatestMessages.data)
                    const oldMessage = {...newMessages[findIndex]}
                    const isFirstMessage = oldMessage.message === null && oldMessage.photoURL === null
                    newMessages.splice(findIndex, 1)
                    return {
                        ...queryData,
                        getLatestMessages: {
                            ...queryData.getLatestMessages,
                            data: [message, ...newMessages],
                            total: isFirstMessage ? queryData.getLatestMessages.total + 1 : queryData.getLatestMessages.total
                        }
                    }
                } else {
                    return {
                        ...queryData,
                        getLatestMessages: {
                            ...queryData.getLatestMessages,
                            data: [message, ...queryData.getLatestMessages.data],
                            total: message.temporary ? queryData.getLatestMessages.total : queryData.getLatestMessages.total + 1
                        }
                    }
                }
            }
        })
    }

    return [addLatestMessage] as const
}