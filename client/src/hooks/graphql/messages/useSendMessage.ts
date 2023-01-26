import { useMutation } from '@apollo/client'
import { CREATE_MESSAGE } from '../../../graphql/mutations/messages'
import { FullMessage } from '../../../types'
import { useLoggedInUser } from '../../misc'
import { useAddLatestMessage } from './useAddLatestMessage'
import { useAddChatMessage } from './useAddChatMessage'
import { v4 as uuid } from 'uuid'
import moment from 'moment'


export function useSendMessage () {

    const [loggedInUser] = useLoggedInUser()

    const [createMessage] = useMutation<{ createMessage: FullMessage }>(CREATE_MESSAGE)
    const [addChatMessage] = useAddChatMessage()
    const [addLatestMessage] = useAddLatestMessage()

    const sendMessage = (userId: string, message: string | null, photoURL: string | null) => {
        const addMessage = {
            _id: uuid(),
            fromUserId: loggedInUser._id,
            toUserId: userId,
            message,
            photoURL,
            createdAt: moment().valueOf(),
        }
        addChatMessage(userId, addMessage, true)
        createMessage({
            variables: {
                message: {
                    toUserId: userId,
                    message,
                    photoURL,
                }
            }
        }).then(data => {
            const createMessage = data.data?.createMessage
            if (createMessage) {
                addChatMessage(userId, {
                    ...createMessage,
                    fromUserId: createMessage.fromUser._id,
                    toUserId: createMessage.toUser._id,
                }, false, addMessage._id)
                addLatestMessage(createMessage)
            }
        }).catch(console.log)
    }

    return [sendMessage] as const
}