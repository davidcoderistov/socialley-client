import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import CreateIcon from '@mui/icons-material/Create'
import ChatMessageListItem from './ChatMessageListItem'
import InfiniteScroll from 'react-infinite-scroll-component'
import _range from 'lodash/range'
import { MessageUser } from '../../types'


interface Message {
    _id: string
    message: string | null
    photoURL: string | null
    timestamp: number
    selected: boolean
    sent: boolean
    user: MessageUser
}

interface Props {
    username: string
    onViewProfile: () => void
    onMessage: () => void
    messages: Message[]
    messagesLoading: boolean
    onClickUser: (userId: string) => void
    onFetchMore: () => void
    hasMore: boolean
}

export default function ChatMessageList (props: Props) {

    return (
        <Box
            component='div'
            alignItems='stretch'
            border='0'
            borderRight='1px solid #363636'
            boxSizing='border-box'
            display='flex'
            flexDirection='column'
            flexShrink='0'
            height='100%'
            margin='0'
            overflow='hidden'
            padding='0'
            position='relative'
            width='350px'
            sx={{ verticalAlign: 'baseline' }}
            bgcolor='#000000'
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
                    alignItems='center'
                    display='flex'
                    flexDirection='row'
                    height='inherit'
                    justifyContent='space-between'
                    width='100%'
                >
                    <Box
                        component='div'
                        marginRight='8px'
                        display='flex'
                        flexBasis='32px'
                        flexDirection='row'
                    />
                    <Box
                        component='div'
                        alignItems='center'
                        color='#FFFFFF'
                        display='inline-block'
                        flexBasis='0px'
                        flexGrow='1'
                        flexShrink='1'
                        justifyContent='center'
                        minWidth='0'
                        textAlign='center'
                        overflow='hidden'
                        textOverflow='ellipsis'
                        whiteSpace='nowrap'
                    >
                        <Box
                            component='div'
                            width='100%'
                            flex='0 0 auto'
                            justifyContent='flex-start'
                            flexDirection='column'
                            alignItems='stretch'
                            alignContent='stretch'
                            display='flex'
                            boxSizing='border-box'
                            position='relative'
                        >
                            <Typography
                                component='div'
                                variant='body1'
                                sx={{ cursor: 'pointer' }}
                                onClick={props.onViewProfile}
                            >
                                { props.username }
                            </Typography>
                        </Box>
                    </Box>
                    <Box
                        component='div'
                        justifyContent='flex-end'
                        marginLeft='8px'
                        display='flex'
                        flexBasis='32px'
                        flexDirection='row'
                    >
                        <IconButton sx={{ color: '#FFFFFF' }} onClick={props.onMessage}>
                            <CreateIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
            <Box
                component='div'
                height='100%'
                overflow='hidden'
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
                    height='100%'
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
                    <Box
                        component='div'
                        display='block'
                        overflow='hidden'
                        height='calc(100% - 44px)'
                    >
                        <Box
                            id='scrollableUserList'
                            component='div'
                            display='block'
                            height='100%'
                            overflow='hidden auto'
                            paddingTop='8px'
                            paddingBottom='24px'
                            sx={{ overscrollBehavior: 'contain' }}
                        >
                            { props.messagesLoading ? (
                                <Box
                                    component='div'
                                    display='flex'
                                    position='relative'
                                    flexDirection='column'
                                    paddingY='0'
                                >
                                    { _range(10).map(index => (
                                        <ChatMessageListItem
                                            key={index}
                                            loading={true} />
                                    ))}
                                </Box>
                            ) : props.messages.length > 0 ? (
                                <InfiniteScroll
                                    next={props.onFetchMore}
                                    hasMore={props.hasMore}
                                    loader={
                                        <Box
                                            component='div'
                                            display='flex'
                                            flexDirection='row'
                                            justifyContent='center'
                                            alignItems='flex-start'
                                            height='60px'
                                        >
                                            <CircularProgress size={30} sx={{ color: '#FFFFFF', mt: 1 }} />
                                        </Box>
                                    }
                                    dataLength={props.messages.length}
                                    scrollableTarget='scrollableUserList'
                                >
                                    <Box
                                        component='div'
                                        display='flex'
                                        position='relative'
                                        flexDirection='column'
                                        paddingY='0'
                                    >
                                        { props.messages.map(message => (
                                            <ChatMessageListItem
                                                key={message._id}
                                                _id={message._id}
                                                userId={message.user._id}
                                                firstName={message.user.firstName}
                                                lastName={message.user.lastName}
                                                avatarURL={message.user.avatarURL}
                                                photoURL={message.photoURL}
                                                message={message.message}
                                                timestamp={message.timestamp}
                                                selected={message.selected}
                                                sent={message.sent}
                                                onClick={(userId) => props.onClickUser(userId)} />
                                        ))}
                                    </Box>
                                </InfiniteScroll>
                            ) : (
                                <Box
                                    component='div'
                                    height='100%'
                                    width='100%'
                                    display='flex'
                                    flexDirection='column'
                                    justifyContent='center'
                                    alignItems='center'
                                >
                                    <Typography
                                        variant='body2'
                                        color='#757575'
                                    >
                                        No new messages
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}