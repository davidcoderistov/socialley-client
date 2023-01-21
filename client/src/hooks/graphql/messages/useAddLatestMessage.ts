import { useContext } from 'react'
import { useApolloClient } from '@apollo/client'
import { GET_LATEST_MESSAGES } from '../../../graphql/queries/messages'
import AppContext from '../../../config/context'
import { LatestMessagesQueryData } from '../../../graphql/types'
import { User, FullMessage } from '../../../types'


export function useAddLatestMessage () {

    const context = useContext(AppContext)
    const loggedInUser = context.loggedInUser as User

    const client = useApolloClient()

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
                    newMessages.splice(findIndex, 1)
                    return {
                        ...queryData,
                        getLatestMessages: {
                            ...queryData.getLatestMessages,
                            data: [message, ...newMessages]
                        }
                    }
                } else {
                    return {
                        ...queryData,
                        getLatestMessages: {
                            ...queryData.getLatestMessages,
                            data: [message, ...queryData.getLatestMessages.data],
                            total: queryData.getLatestMessages.total + 1
                        }
                    }
                }
            }
        })
    }

    return [addLatestMessage] as const
}