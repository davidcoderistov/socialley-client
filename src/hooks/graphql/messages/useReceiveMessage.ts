import { useSubscription, useLazyQuery, useApolloClient } from '@apollo/client'
import { GET_LATEST_MESSAGES, GET_LATEST_MESSAGES_COUNT } from '../../../graphql/queries/messages'
import { GetLatestMessagesQueryType, GetLatestMessagesCountQueryType } from '../../../graphql/types/queries/messages'
import { MESSAGE_CREATED_SUBSCRIPTION } from '../../../graphql/subscriptions/messages'
import { FullMessage } from '../../../graphql/types/models'
import { useLoggedInUser } from '../../misc'
import { useAddLatestMessage } from './useAddLatestMessage'
import { useAddChatMessage } from './useAddChatMessage'


export function useReceiveMessage () {

    const client = useApolloClient()

    const [loggedInUser] = useLoggedInUser()
    const [addLatestMessage] = useAddLatestMessage()
    const [addChatMessage] = useAddChatMessage()

    const [getLatestMessagesCount] = useLazyQuery<GetLatestMessagesCountQueryType>(GET_LATEST_MESSAGES_COUNT)

    useSubscription<{ messageCreated: FullMessage }>(MESSAGE_CREATED_SUBSCRIPTION, {
        onData (data) {
            if (!data.data.error) {
                const message = data.data.data?.messageCreated
                if (message) {
                    const userId = message.fromUser._id === loggedInUser._id ?
                        message.toUser._id : message.fromUser._id
                    const queryData: GetLatestMessagesQueryType | null = client.cache.readQuery({
                        query: GET_LATEST_MESSAGES,
                    })
                    const findIndex = queryData?.getLatestMessages.data.findIndex(latestMessage =>
                        (latestMessage.fromUser._id === loggedInUser._id && latestMessage.toUser._id === userId) ||
                        (latestMessage.toUser._id === loggedInUser._id && latestMessage.fromUser._id === userId))
                    if (findIndex != null && findIndex < 0) {
                        getLatestMessagesCount().then(data => {
                            if (data.data) {
                                const count = data.data?.getLatestMessagesCount.count
                                client.cache.updateQuery({
                                    query: GET_LATEST_MESSAGES,
                                }, (queryData: GetLatestMessagesQueryType | null) => {
                                    if (queryData) {
                                        return {
                                            ...queryData,
                                            getLatestMessages: {
                                                ...queryData.getLatestMessages,
                                                total: count
                                            }
                                        }
                                    }
                                })
                            }
                        }).catch(console.log)
                    }
                    addLatestMessage({ ...message, temporary: false })
                    addChatMessage(userId, {
                        ...message,
                        fromUserId: message.fromUser._id,
                        toUserId: message.toUser._id,
                        temporary: false,
                    })
                }
            }
        }
    })
}
