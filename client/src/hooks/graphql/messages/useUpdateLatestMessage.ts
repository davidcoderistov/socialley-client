import { useContext } from 'react'
import { useApolloClient } from '@apollo/client'
import { GET_LATEST_MESSAGES } from '../../../graphql/queries/messages'
import AppContext from '../../../config/context'
import { LatestMessagesQueryData } from '../../../graphql/types'
import { User } from '../../../types'


interface LatestMessage {
    _id: string
    message?: string | null
    photoURL?: string | null
    createdAt: number
}

export function useUpdateLatestMessage () {

    const context = useContext(AppContext)
    const loggedInUser = context.loggedInUser as User

    const client = useApolloClient()

    const updateLatestMessage = (userId: string, { _id, message = null, photoURL = null, createdAt }: LatestMessage): boolean => {
        let success = false
        client.cache.updateQuery({
            query: GET_LATEST_MESSAGES,
        }, (queryData: LatestMessagesQueryData | null) => {
            if (queryData) {
                const findIndex = queryData.getLatestMessages.data.findIndex(latestMessage =>
                    (latestMessage.fromUser._id === loggedInUser._id && latestMessage.toUser._id === userId) ||
                    (latestMessage.toUser._id === loggedInUser._id && latestMessage.fromUser._id === userId))
                if (findIndex > -1) {
                    success = true
                    const latestMessage = queryData.getLatestMessages.data[findIndex]
                    const newMessages = Array.from(queryData.getLatestMessages.data)
                    newMessages.splice(findIndex, 1)
                    return {
                        ...queryData,
                        getLatestMessages: {
                            ...queryData.getLatestMessages,
                            data: [{
                                ...latestMessage,
                                messageId: _id,
                                message,
                                photoURL,
                                createdAt,
                            }, ...newMessages]
                        }
                    }
                }
            }
        })
        return success
    }

    return [updateLatestMessage] as const
}