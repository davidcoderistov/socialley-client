import { useContext } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_MESSAGE } from '../../../graphql/mutations/messages'
import AppContext from '../../../config/context'
import { FullMessage, User } from '../../../types'
import { useAddChatMessage } from './useAddChatMessage'
import { useAddLatestMessage } from './useAddLatestMessage'
import { v4 as uuid } from 'uuid'
import moment from 'moment'


export function useSendMessage () {

    const context = useContext(AppContext)
    const loggedInUser = context.loggedInUser as User

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
            createdAt: moment().unix(),
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
                    _id: createMessage._id,
                    fromUserId: createMessage.fromUser._id,
                    toUserId: createMessage.toUser._id,
                    message: createMessage.message,
                    photoURL: createMessage.photoURL,
                    createdAt: createMessage.createdAt,
                }, false, addMessage._id)
                addLatestMessage(createMessage)
            }
        }).catch(console.log)
    }

    return [sendMessage] as const
}