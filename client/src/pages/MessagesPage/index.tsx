import React, { useState, useMemo } from 'react'
import { useLoggedInUser } from '../../hooks/misc'
import { useApolloClient, useLazyQuery } from '@apollo/client'
import { useAddLatestMessage } from '../../hooks/graphql/messages'
import { GET_LATEST_MESSAGES, GET_LATEST_MESSAGE } from '../../graphql/queries/messages'
import { GetLatestMessagesQueryType } from '../../graphql/types/queries/messages'
import Box from '@mui/material/Box'
import ChatMessageList from '../../components/Chat/ChatMessageList'
import Chat from '../../components/Chat/Chat'
import SendMessageContainer from '../../components/Chat/SendMessageContainer'
import SendMessageModal from '../../components/SendMessageModal'
import { FullMessage, MessageUser } from '../../types'
import { v4 as uuid } from 'uuid'
import moment from 'moment'


interface Message {
    _id: string
    message: string | null
    photoURL: string | null
    timestamp: number
    selected: boolean
    sent: boolean
    user: MessageUser
}

interface MessagesPageProps {
    latestMessages: FullMessage[]
    latestMessagesCount: number
    latestMessagesLoading: boolean
    hasMoreLatestMessages: boolean
    fetchMoreMessages: () => void
}

interface SendMessageUser {
    _id: string
    username: string
    firstName: string
    lastName: string
    avatarURL?: string | null
}

export default function MessagesPage (props: MessagesPageProps) {

    const client = useApolloClient()

    const [getLatestMessage] = useLazyQuery(GET_LATEST_MESSAGE)

    const [loggedInUser] = useLoggedInUser()
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
    const [sendMessageModalOpen, setSendMessageModalOpen] = useState(false)

    const [addLatestMessage] = useAddLatestMessage()

    const messages: Message[] = useMemo(() => {
        if (Array.isArray(props.latestMessages)) {
            return props.latestMessages.map(message => {
                const user = message.fromUser._id === loggedInUser._id ? message.toUser : message.fromUser
                return {
                    _id: message._id,
                    message: message.message,
                    photoURL: message.photoURL,
                    timestamp: message.createdAt,
                    selected: selectedUserId === user._id,
                    sent: message.fromUser._id === loggedInUser._id,
                    user: {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        avatarURL: user.avatarURL,
                    }
                }
            })
        }
        return []
    }, [props.latestMessages, selectedUserId])

    const selectedUser: MessageUser | null = useMemo(() => {
        const message = messages.find(message => message.user._id === selectedUserId)
        if (message) {
            return message.user
        }
        return null
    }, [selectedUserId])

    const handleClickUser = (_id: string) => {
        setSelectedUserId(_id)
    }

    const handleViewProfile = () => {

    }

    const handleMessage = () => {
        setSendMessageModalOpen(true)
    }

    const handleClickSendMessage = () => {
        setSendMessageModalOpen(true)
    }

    const handleCloseSendMessageModal = () => {
        setSendMessageModalOpen(false)
    }

    const handleClickSendMessageToUser = async (user: SendMessageUser) => {
        setSendMessageModalOpen(false)
        const queryData: GetLatestMessagesQueryType | null = client.cache.readQuery({
            query: GET_LATEST_MESSAGES,
        })
        if (queryData) {
            const findIndex = queryData.getLatestMessages.data.findIndex(latestMessage =>
                (latestMessage.fromUser._id === loggedInUser._id && latestMessage.toUser._id === user._id) ||
                (latestMessage.toUser._id === loggedInUser._id && latestMessage.fromUser._id === user._id))
            if (findIndex > -1) {
                // TODO: Scroll to user
                setSelectedUserId(user._id)
                return
            }
        }
        getLatestMessage({
            variables: {
                userId: user._id
            }
        }).then(data => {
            const message = data.data?.getLatestMessage
            addLatestMessage(message ? { ...message, temporary: true } : createLatestMessage(user))
        }).catch(console.log).finally(() => setSelectedUserId(user._id))
    }

    const createLatestMessage = (user: SendMessageUser) => ({
        _id: uuid(),
        fromUser: {
            _id: loggedInUser._id,
            firstName: loggedInUser.firstName,
            lastName: loggedInUser.lastName,
            avatarURL: loggedInUser.avatarURL ?? null
        },
        toUser: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            avatarURL: user.avatarURL ?? null
        },
        message: null,
        photoURL: null,
        createdAt: moment().valueOf(),
        temporary: true,
    })

    return (
        <Box component='div' width='100%' height='100%' paddingY='10px' paddingX='130px'>
            <Box
                component='div'
                alignItems='center'
                border='0'
                boxSizing='border-box'
                display='flex'
                flexDirection='column'
                flexShrink='0'
                height='100%'
                margin={0}
                padding='20px'
                position='relative'
                width='100%'
                sx={{ verticalAlign: 'baseline' }}
            >
                <Box
                    component='div'
                    height='100%'
                    width='100%'
                    overflow='hidden'
                    flex='1 1 auto'
                    minHeight={0}
                    minWidth={0}
                    justifyContent='center'
                    flexDirection='row'
                    alignItems='stretch'
                    alignContent='stretch'
                    display='flex'
                    borderRadius='4px'
                    border='1px solid #262626'
                    boxSizing='border-box'
                    position='relative'
                >
                    <ChatMessageList
                        username={loggedInUser.username}
                        messages={messages}
                        messagesLoading={props.latestMessagesLoading}
                        onClickUser={handleClickUser}
                        onViewProfile={handleViewProfile}
                        onMessage={handleMessage}
                        onFetchMore={props.fetchMoreMessages}
                        hasMore={props.hasMoreLatestMessages} />
                    { selectedUser ? (
                        <Chat user={selectedUser} />
                    ): (
                        <SendMessageContainer onSendMessage={handleClickSendMessage} />
                    )}
                </Box>
            </Box>
            { sendMessageModalOpen && (
                <SendMessageModal
                    open={sendMessageModalOpen}
                    onClickUser={handleClickSendMessageToUser}
                    onCloseModal={handleCloseSendMessageModal} />
            )}
        </Box>
    )
}