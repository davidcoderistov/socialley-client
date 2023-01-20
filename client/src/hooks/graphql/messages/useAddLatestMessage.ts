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

interface UserArg {
    _id: string
    firstName: string
    lastName: string
}

export function useAddLatestMessage () {

    const context = useContext(AppContext)
    const loggedInUser = context.loggedInUser as User

    const client = useApolloClient()

    const addLatestMessage = (user: UserArg, { _id, message = null, photoURL = null, createdAt }: LatestMessage) => {
        client.cache.updateQuery({
            query: GET_LATEST_MESSAGES,
        }, (queryData: LatestMessagesQueryData | null) => {
            if (queryData) {
                const findIndex = queryData.getLatestMessages.data.findIndex(latestMessage =>
                    (latestMessage.fromUser._id === loggedInUser._id && latestMessage.toUser._id === user._id) ||
                    (latestMessage.toUser._id === loggedInUser._id && latestMessage.fromUser._id === user._id))
                if (findIndex > -1) {
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
                } else {
                    return {
                        ...queryData,
                        getLatestMessages: {
                            ...queryData.getLatestMessages,
                            data: [{
                                messageId: _id,
                                fromUser: {
                                    _id: user._id,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                },
                                toUser: {
                                    _id: loggedInUser._id,
                                    firstName: loggedInUser.firstName,
                                    lastName: loggedInUser.lastName,
                                },
                                message,
                                photoURL,
                                createdAt,
                            }, ...queryData.getLatestMessages.data],
                            total: queryData.getLatestMessages.total + 1
                        }
                    }
                }
            }
        })
    }

    return [addLatestMessage] as const
}