import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Done } from '@mui/icons-material'


export default function AllCaughtUp () {

    return (
        <Box
            component='div'
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            width='100%'
            marginTop='44px'
        >
            <Box
                component='div'
                display='flex'
                flexDirection='column'
                justifyContent='center'
                alignItems='center'
                paddingBottom='20px'
                borderBottom='1px solid #262626'
            >
                <Done
                    sx={{
                        fontSize: 100,
                        color: '#a94064',
                        border: '5px solid #722b43',
                        borderRadius: '50%',
                        marginBottom: '16px',
                    }} />
                <Typography
                    variant='h6'
                    marginBottom='4px'
                >
                    You're all caught up
                </Typography>
                <Typography
                    variant='body2'
                    color='#A8A8A8'
                >
                    You've seen all new posts from the people you follow.
                </Typography>
            </Box>
        </Box>
    )
}