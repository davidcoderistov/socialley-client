import React, { useRef, useEffect } from 'react'
import Box from '@mui/material/Box'
import SuggestedPostsFeed from '../../components/SuggestedPostsFeed'


export default function SuggestedPostsPage () {

    const scrollRef = useRef<HTMLElement>();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView()
        }
    }, [])

    return (
        <Box
            ref={scrollRef}
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