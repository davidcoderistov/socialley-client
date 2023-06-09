import React from 'react'
import Box from '@mui/material/Box'
import Message from './Message'
import Image from '../Image'


type MessageType = 'sent' | 'received'

interface User {
    firstName: string
    lastName: string
    photoURL?: string | null
}

interface Props {
    messageType: MessageType
    showAvatar?: boolean
    user?: User | null
    photoURL?: string | null
}

export default function PhotoMessage (props: Props) {

    return (
        <Message
            messageType={props.messageType}
            showAvatar={props.showAvatar}
            user={props.user}
            {...props.messageType === 'sent' && { bubbleProps: { bgcolor: '#262626' }}}
            bubbleSxProps={{ cursor: 'pointer' }}
        >
            <Box
                component='div'
                height='136px'
                minWidth='236px'
                flex='0 0 auto'
                justifyContent='flex-start'
                flexDirection='column'
                alignItems='stretch'
                alignContent='stretch'
                display='flex'
                boxSizing='border-box'
                position='relative'
            >
                { props.photoURL && (
                    <Image
                        url={props.photoURL}
                        remote={true}
                        minHeight='100%'
                        minWidth='100%'
                        border={0} />
                )}
            </Box>
        </Message>
    )
}