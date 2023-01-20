import React, { useState, useMemo, useContext } from 'react'
import Box from '@mui/material/Box'
import ChatMessageList from '../../components/Chat/ChatMessageList'
import Chat from '../../components/Chat/Chat'
import AppContext from '../../config/context'
import { User, FullMessage, MessageUser } from '../../types'


interface Message {
    _id: string
    message: string | null
    photoURL: string | null
    timestamp: number
    selected: boolean
    user: MessageUser
}

interface MessagesPageProps {
    latestMessages: FullMessage[]
    latestMessagesCount: number
    latestMessagesLoading: boolean
    fetchMoreMessages: () => void
}

export default function MessagesPage (props: MessagesPageProps) {

    const context = useContext(AppContext)
    const loggedInUser = context.loggedInUser as User

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

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

    }

    return (
        <Box component='div' width='100%' height='670px'>
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
                    maxWidth='935px'
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
                        hasMore={props.latestMessages.length < props.latestMessagesCount} />
                    { selectedUser ? (
                        <Chat user={selectedUser} />
                    ): (
                        <div>Empty STATE</div>
                    )}
                </Box>
            </Box>
        </Box>
    )
}