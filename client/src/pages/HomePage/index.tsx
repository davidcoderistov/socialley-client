import React from 'react'
import Box from '@mui/material/Box'
import FollowedUsersPosts from '../../components/FollowedUsersPosts'
import TopFiveSuggestedUsers from '../../components/TopFiveSuggestedUsers'


export default function HomePage () {

    return (
        <Box
            component='div'
            display='flex'
            flexDirection='row'
            width='100%'
            padding='50px'
        >
            <FollowedUsersPosts
                component='div'
                display='flex'
                flexDirection='column'
                justifyContent='center'
                alignItems='center'
                flex='1 1 auto' />
            <Box
                component='div'
                display='flex'
                flexDirection='column'
                flex='0 0 440px'
            >
                <TopFiveSuggestedUsers />
            </Box>
        </Box>
    )
}