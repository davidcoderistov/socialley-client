import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'


interface TopFourNotificationsProps {
    children: any
    title: string
    showSeeAll: boolean
    onClickSeeAll: () => void
}

export default function TopThreeNotifications (props: TopFourNotificationsProps) {

    return (
        <Box
            component='div'
            display='block'
            marginBottom='20px'
        >
            <Box
                component='div'
                display='flex'
                flexDirection='row'
                justifyContent='space-between'
                alignItems='center'
                paddingX='24px'
                marginBottom='5px'
            >
                <Typography
                    fontSize={16}
                    color='#FFFFFF'
                    noWrap
                >
                    { props.title }
                </Typography>
                { props.showSeeAll && (
                    <Button
                        variant='text'
                        color='primary'
                        sx={{
                            textTransform: 'none',
                            '&:hover': {
                                color: '#FFFFFF'
                            }
                        }}
                        onClick={props.onClickSeeAll}
                    >
                        See All
                    </Button>
                )}
            </Box>
            { props.children }
        </Box>
    )
}