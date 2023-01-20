import React, { useState, useEffect, useMemo, useContext } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_MESSAGE } from '../../graphql/mutations/messages'
import AppContext from '../../config/context'
import { User, Message } from '../../types'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { PhotoOutlined } from '@mui/icons-material'
import InputBase from '@mui/material/InputBase'
import UserAvatar from '../UserAvatar'
import TextMessage from './TextMessage'
import PhotoMessage from './PhotoMessage'
import MessageSeparator from './MessageSeparator'
import { useLatestChatMessages, useAddChatMessage, useUpdateChatMessage, useAddLatestMessage } from '../../hooks/graphql/messages'
import _reverse from 'lodash/reverse'
import moment from 'moment'


const parseMessages = (apiMessages: Message[], userId: string) => {
    let showAvatar = false
    let avatarShown = false
    return apiMessages.map(message => {
        const messageType = message.fromUserId === userId ? 'received' : 'sent'
        if (messageType === 'sent') {
            showAvatar = false
            avatarShown = false
        } else {
            showAvatar = !avatarShown && !showAvatar
            if (!avatarShown && showAvatar) {
                avatarShown = true
            }
        }
        if (message.photoURL) {
            return (
                <PhotoMessage
                    key={message._id}
                    messageType={messageType}
                    photoURL={message.photoURL}
                    showAvatar={showAvatar}
                    user={{ firstName: 'Anita', lastName: 'Ristova' }} />
            )
        } else if (message.message) {
            return (
                <TextMessage
                    key={message._id}
                    messageType={messageType}
                    message={message.message}
                    showAvatar={showAvatar}
                    user={{ firstName: 'Anita', lastName: 'Ristova' }} />
            )
        }
    })
}

const addMessageSeparators = (currentMessages: React.ReactNode[], originalMessages: Message[], messagesCount: number) => {
    let separatorsCount = 0
    for (let i = 0; i < originalMessages.length - 1; ++i) {
        const first = moment(originalMessages[i].createdAt)
        const second = moment(originalMessages[i+1].createdAt)
        if (second.diff(first, 'minutes') > 10) {
            currentMessages.splice(separatorsCount + i + 1, 0, (
                <MessageSeparator
                    key={i}
                    timestamp={originalMessages[i+1].createdAt} />
            ))
            ++separatorsCount
        }
    }
    if (originalMessages.length === messagesCount) {
        currentMessages.splice(0, 0, (
            <MessageSeparator
                key='first-message-separator'
                timestamp={originalMessages[0].createdAt} />
        ))
    }
    return currentMessages
}

interface ChatProps {
    user: {
        _id: string
        firstName: string
        lastName: string
    }
}

export default function Chat ({ user }: ChatProps) {

    const context = useContext(AppContext)
    const loggedInUser = context.loggedInUser as User

    const [message, setMessage] = useState('')

    const [createMessage] = useMutation<{ createMessage: Message }>(CREATE_MESSAGE)
    const [addChatMessage] = useAddChatMessage()
    const [updateChatMessage] = useUpdateChatMessage()
    const [addLatestMessage] = useAddLatestMessage()

    const [
        loadChatMessages,
        fetchMoreChatMessages,
        getChatMessages,
    ] = useLatestChatMessages({ limit: 10 })

    const data = getChatMessages(user._id)

    const messages = useMemo(() => {
        if (data) {
            const messagesReversed = _reverse(Array.from(data.chatMessages))
            return addMessageSeparators(
                parseMessages(
                    messagesReversed,
                    user._id,
                ),
                messagesReversed,
                data.chatMessagesCount
            )
        }
        return []
    }, [data, user])

    useEffect(() => {
        if (data === null) {
            loadChatMessages(user._id)
        }
    }, [user, data])

    const onSendMessage = () => {
        const addMessage = addChatMessage(user._id, {
            fromUserId: loggedInUser._id,
            toUserId: user._id,
            message,
        })
        if (addMessage) {
            createMessage({
                variables: {
                    message: {
                        toUserId: user._id,
                        message,
                    }
                }
            }).then((data) => {
                const createMessage = data.data?.createMessage
                if (createMessage) {
                    updateChatMessage({ userId: user._id, messageId: addMessage._id }, createMessage)
                    addLatestMessage(user, {
                        _id: createMessage._id,
                        message: createMessage.message,
                        photoURL: createMessage.photoURL,
                        createdAt: createMessage.createdAt,
                    })
                }
            }).catch(console.log)
            setMessage('')
        }
    }

    const onChangeMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value)
    }

    return (
        <Box
            component='div'
            height='auto'
            display='flex'
            flexDirection='column'
            justifyContent='flex-start'
            alignItems='stretch'
            alignContent='stretch'
            flex='1 1 auto'
            boxSizing='border-box'
            position='relative'
            minHeight={0}
            minWidth={0}
        >
            <Box
                component='div'
                display='flex'
                flexDirection='column'
                alignItems='stretch'
                flexShrink='0'
                boxSizing='border-box'
                position='absolute'
                width='100%'
                margin={0}
                padding={0}
                border={0}
                sx={{ verticalAlign: 'baseline' }}
            >
                <Box
                    component='div'
                    borderBottom='1px solid #363636'
                    boxSizing='border-box'
                    display='flex'
                    flexDirection='column'
                    flexWrap='wrap'
                    fontSize='16px'
                    fontWeight='600'
                    height='60px'
                    padding='0 20px'
                    width='100%'
                    zIndex='2'
                >
                    <Box
                        component='div'
                        display='flex'
                        flexDirection='row'
                        alignItems='center'
                        height='inherit'
                        justifyContent='space-between'
                        width='100%'
                    >
                        <Box
                            component='div'
                            display='flex'
                            flexDirection='row'
                            flexBasis='0px'
                            marginRight='8px' />
                        <Box
                            component='div'
                            alignItems='flex-start'
                            textAlign='left'
                            color='#FFFFFF'
                            display='flex'
                            flexBasis='0px'
                            flexGrow='1'
                            flexShrink='1'
                            justifyContent='center'
                            minWidth={0}
                            overflow='hidden'
                            textOverflow='ellipsis'
                            whiteSpace='nowrap'
                        >
                            <Box
                                component='div'
                                width='100%'
                                justifyContent='flex-start'
                                flex='0 0 auto'
                                flexDirection='row'
                                alignItems='center'
                                alignContent='stretch'
                                display='flex'
                                boxSizing='border-box'
                                position='relative'
                            >
                                <Box
                                    component='div'
                                    marginLeft='8px'
                                    flex='0 0 auto'
                                    justifyContent='flex-start'
                                    flexDirection='column'
                                    alignItems='stretch'
                                    alignContent='stretch'
                                    display='flex'
                                    boxSizing='border-box'
                                    position='relative'
                                >
                                    <UserAvatar
                                        firstName={user.firstName}
                                        lastName={user.lastName}
                                        size={24}
                                        fontSize={12} />
                                </Box>
                                <Box
                                    component='div'
                                    minWidth={0}
                                    marginLeft='12px'
                                    flex='0 1 auto'
                                    justifyContent='flex-start'
                                    flexDirection='column'
                                    alignItems='stretch'
                                    alignContent='stretch'
                                    display='flex'
                                    boxSizing='border-box'
                                    position='relative'
                                >
                                    <Typography
                                        variant='body1'
                                        noWrap
                                    >
                                        { user.firstName } { user.lastName }
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box
                            component='div'
                            display='flex'
                            justifyContent='flex-end'
                            marginLeft='8px'
                            flexBasis='32px'
                            flexDirection='row'
                        >
                            BUTTON
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box
                component='div'
                alignItems='stretch'
                border='0'
                boxSizing='border-box'
                display='flex'
                flexDirection='row'
                flexShrink='0'
                height='100%'
                margin={0}
                padding={0}
                position='relative'
                width='100%'
                sx={{ verticalAlign: 'baseline' }}
            >
                <Box
                    component='div'
                    paddingTop='60px'
                    width='100%'
                    display='flex'
                    flex='2 1 auto'
                    flexDirection='column'
                >
                    <Box
                        component='div'
                        height='100%'
                        width='100%'
                        flex='1 1 auto'
                        minHeight={0}
                        minWidth={0}
                        justifyContent='flex-end'
                        flexDirection='column'
                        alignItems='stretch'
                        alignContent='stretch'
                        display='flex'
                        boxSizing='border-box'
                        position='relative'
                    >
                        <Box
                            component='div'
                            display='block'
                            paddingX='20px'
                            paddingTop='20px'
                            flex='0 1 auto'
                            sx={{ overflowX: 'hidden', overflowY: 'auto' }}
                        >
                            <Box
                                component='div'
                                display='block'
                            >
                                { messages }
                            </Box>
                        </Box>
                    </Box>
                    <Box
                        component='div'
                        flex='0 0 auto'
                        justifyContent='flex-start'
                        flexDirection='column'
                        alignItems='stretch'
                        alignContent='stretch'
                        display='flex'
                        boxSizing='border-box'
                        position='relative'
                    >
                        <Box
                            component='div'
                            padding='20px'
                            flex='0 0 auto'
                            justifyContent='flex-start'
                            flexDirection='column'
                            alignItems='stretch'
                            alignContent='stretch'
                            display='flex'
                            boxSizing='border-box'
                            position='relative'
                        >
                            <Box
                                component='div'
                                alignItems='center'
                                border='1px solid #363636'
                                borderRadius='22px'
                                boxSizing='border-box'
                                display='flex'
                                flexDirection='row'
                                flexShrink='0'
                                margin='0'
                                padding='0'
                                minHeight='44px'
                                paddingLeft='11px'
                                paddingRight='8px'
                                position='relative'
                            >
                                <IconButton sx={{ color: '#FFFFFF' }}>
                                    <PhotoOutlined />
                                </IconButton>
                                <Box
                                    component='div'
                                    marginRight='4px'
                                    flex='1 1 auto'
                                    minHeight='0'
                                    minWidth='0'
                                    justifyContent='flex-start'
                                    flexDirection='column'
                                    alignItems='stretch'
                                    alignContent='stretch'
                                    display='flex'
                                    boxSizing='border-box'
                                    position='relative'
                                >
                                    <InputBase
                                        sx={{
                                            '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                                display: 'none',
                                            },
                                            '& input': {
                                                MozAppearance: 'textfield'
                                            },
                                            color: '#FFFFFF',
                                            '&.MuiInputBase-root.Mui-disabled': {
                                                color: 'red' // (default alpha is 0.38)
                                            },
                                            '&.Mui-disabled': { '.MuiInputBase-input': { 'WebkitTextFillColor': '#7A7C7F' } },
                                        }}
                                        placeholder='Message...'
                                        fullWidth
                                        value={message}
                                        onChange={onChangeMessage}
                                    />
                                </Box>
                                <Button
                                    variant='text'
                                    sx={{ textTransform: 'none' }}
                                    onClick={onSendMessage}
                                >
                                    Send
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}