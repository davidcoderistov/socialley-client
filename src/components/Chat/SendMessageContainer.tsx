import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import { Reply } from '@mui/icons-material'


export default function SendMessageContainer ({ onSendMessage }: { onSendMessage: () => void }) {

    return (
        <Box
            component='div'
            height='auto'
            flex='1 1 auto'
            minHeight={0}
            minWidth={0}
            display='flex'
            flexDirection='column'
            justifyContent='flex-start'
            alignItems='stretch'
            position='relative'
            boxSizing='border-box'
            bgcolor='#000000'
        >
            <Box
                component='div'
                height='100%'
                width='100%'
                padding='24px'
                flex='0 0 auto'
                display='flex'
                flexDirection='column'
                justifyContent='center'
                alignItems='center'
                alignContent='stretch'
                position='relative'
                boxSizing='border-box'
            >
                <Box
                    component='div'
                    display='flex'
                    flexDirection='column'
                    justifyContent='center'
                    alignItems='center'
                    position='relative'
                    boxSizing='border-box'
                    border='3px solid #FFFFFF'
                    borderRadius='50%'
                    padding='20px'
                >
                    <Reply sx={{ fontSize: 60 }}/>
                </Box>
                <Box
                    component='div'
                    display='flex'
                    flexDirection='column'
                    justifyContent='flex-start'
                    alignItems='stretch'
                    alignContent='stretch'
                    position='relative'
                    boxSizing='border-box'
                    flex='0 0 auto'
                    marginTop='24px'
                >
                    <Typography variant='h6' color='white'>
                        Your Messages
                    </Typography>
                </Box>
                <Box
                    component='div'
                    display='flex'
                    flexDirection='column'
                    justifyContent='flex-start'
                    alignItems='stretch'
                    alignContent='stretch'
                    position='relative'
                    boxSizing='border-box'
                    flex='0 0 auto'
                    marginTop='24px'
                >
                    <Typography variant='body2' color='#8E8E8E'>
                        Send private photos and messages to a friend.
                    </Typography>
                </Box>
                <Box
                    component='div'
                    display='flex'
                    flexDirection='column'
                    justifyContent='flex-start'
                    alignItems='stretch'
                    alignContent='stretch'
                    position='relative'
                    boxSizing='border-box'
                    flex='0 0 auto'
                    marginTop='24px'
                >
                    <Button color='primary' variant='contained' sx={{ textTransform: 'none' }} onClick={onSendMessage}>
                        Send Message
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}