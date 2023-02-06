import React from 'react'
import Box from '@mui/material/Box'


interface Props {
    user: {
        _id: string
        username: string
    }
}

export default function PostLikes (props: Props) {

    return (
        <Box
            component='div'
            minHeight='0'
            minWidth='0'
            justifyContent='flex-start'
            flexDirection='row'
            alignItems='stretch'
            alignContent='stretch'
            display='flex'
            boxSizing='border-box'
            position='relative'
        >
            <Box
                component='div'
                margin='auto'
                flexWrap='wrap'
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
                    color='#FFFFFF'
                    margin='0'
                    fontWeight='400'
                    fontSize='14px'
                    lineHeight='18px'
                >
                    <Box
                        component='span'
                    >
                        Liked by
                    </Box>&nbsp;
                    <Box
                        component='span'
                        fontWeight='600'
                        sx={{ cursor: 'pointer' }}
                    >
                        { props.user.username }
                    </Box>&nbsp;
                    <Box
                        component='span'
                    >
                        and
                    </Box>&nbsp;
                    <Box
                        component='span'
                        fontWeight='bold'
                        sx={{ cursor: 'pointer' }}
                    >
                        others
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}