import React from 'react'
import Box, { BoxProps } from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'
import UserAvatar from '../UserAvatar'
import Image from '../Image'


export default function PostPreview (props: { url: string | null, containerProps?: BoxProps }) {

    return (
        <Box
            component='div'
            display='flex'
            flex='1 1 auto'
            margin='15px'
            {...props.containerProps || {}}
        >
            <Box
                component='div'
                display='flex'
                justifyContent='center'
                height='100%'
                alignItems='flex-start'
                width='450px'
            >
                <Box
                    component='div'
                    alignItems='center'
                    border='0'
                    boxSizing='border-box'
                    display='flex'
                    flexDirection='column'
                    flexShrink='0'
                    height='100%'
                    justifyContent='center'
                    margin='0'
                    padding='0'
                    position='relative'
                    width='100%'
                    sx={{ verticalAlign: 'baseline' }}
                >
                    <Box
                        component='div'
                        alignItems='center'
                        bgcolor='#121212'
                        border='0'
                        boxSizing='border-box'
                        display='flex'
                        flexDirection='column'
                        flexShrink='0'
                        height='100%'
                        justifyContent='center'
                        margin='0'
                        padding='0'
                        position='relative'
                        width='100%'
                        sx={{ verticalAlign: 'baseline' }}
                    >
                        <Box
                            component='div'
                            alignItems='center'
                            display='flex'
                            flexDirection='column'
                            height='100%'
                            width='100%'
                        >
                            <Box
                                component='div'
                                width='100%'
                                height='100%'
                                alignItems='stretch'
                                border='0'
                                boxSizing='border-box'
                                display='flex'
                                flexDirection='column'
                                flexShrink='0'
                                margin='auto'
                                padding='0'
                                position='relative'
                                sx={{ verticalAlign: 'baseline' }}
                            >
                                { props.url && (
                                    <Image
                                        url={props.url}
                                        remote={false}
                                        width='100%'
                                        height='100%'
                                        border='0'
                                        margin='0'
                                        padding='0'
                                        sx={{ verticalAlign: 'baseline' }} />
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box
                component='div'
                display='flex'
                position='relative'
                boxSizing='border-box'
                width='100%'
                borderLeft='1px solid #363636'
            >
                <Box
                    component='div'
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
                        height='100%'
                        overflow='hidden'
                    >
                        <Box
                            component='div'
                            alignItems='stretch'
                            border='0'
                            boxSizing='border-box'
                            display='flex'
                            flexDirection='column'
                            margin='0'
                            padding='0'
                            position='relative'
                            height='100%'
                            sx={{ verticalAlign: 'baseline' }}
                        >
                            <Box
                                component='div'
                                display='flex'
                                margin='0 16px'
                                flex='0 0 auto'
                                justifyContent='flex-start'
                                flexDirection='row'
                                alignItems='center'
                                alignContent='stretch'
                                boxSizing='border-box'
                                position='relative'
                                columnGap='5px'
                            >
                                <UserAvatar
                                    size={40}
                                    fontSize={16}
                                    firstName='David'
                                    lastName='Ristov' />
                                <Typography color='#FFFFFF'>davidristovv</Typography>
                            </Box>
                            <Box
                                component='div'
                                margin='16px'
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
                                height='100%'
                            >
                                <InputBase
                                    sx={{
                                        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                            display: 'none',
                                        },
                                        '& input': {
                                            MozAppearance: 'textfield',
                                            '&::placeholder': {
                                                fontSize: '14px',
                                                color: '#EEEEFF'
                                            },
                                        },
                                        color: '#FFFFFF',
                                    }}
                                    placeholder='Write a caption...'
                                    multiline
                                    maxRows={10}
                                    autoFocus
                                    fullWidth
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}