import React from 'react'
import Box from '@mui/material/Box'
import SuggestedPostsFeed from '../../components/SuggestedPostsFeed'


export default function SuggestedPostsPage () {

    return (
        <Box
            component='div'
            width='100%'
            marginTop='30px'
            paddingLeft='50px'
            paddingRight='20px'
        >
            <SuggestedPostsFeed boxProps={{ marginBottom: '30px' }}/>
        </Box>
    )
}