import { useSubscription } from '@apollo/client'
import { MESSAGE_CREATED_SUBSCRIPTION } from '../../../graphql/subscriptions/messages'
import { FullMessage } from '../../../types'
import { useLoggedInUser } from '../../misc'
import { useAddLatestMessage } from './useAddLatestMessage'
import { useAddChatMessage } from './useAddChatMessage'


export function useReceiveMessage () {

    const [loggedInUser] = useLoggedInUser()
    const [addLatestMessage] = useAddLatestMessage()
    const [addChatMessage] = useAddChatMessage()

    useSubscription<{ messageCreated: FullMessage }>(MESSAGE_CREATED_SUBSCRIPTION, {
        onData (data) {
            if (!data.data.error) {
                const message = data.data.data?.messageCreated
                if (message) {
                    const userId = message.fromUser._id === loggedInUser._id ?
                        message.toUser._id : message.fromUser._id
                    addLatestMessage(message)
                    addChatMessage(userId, {
                        ...message,
                        fromUserId: message.fromUser._id,
                        toUserId: message.toUser._id,
                    })
                }
            }
        }
    })
}
