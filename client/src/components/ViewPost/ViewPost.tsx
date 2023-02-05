import React from 'react'
import Box from '@mui/material/Box'
import Backdrop from '@mui/material/Backdrop'
import IconButton from '@mui/material/IconButton'
import { Close, ExpandCircleDown } from '@mui/icons-material'
import VideoPlayer from './VideoPlayer'
import Comments from './Comments'


export default function ViewPost () {

    return (
        <Backdrop
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
        >
            <Box
                component='div'
                position='absolute'
                boxSizing='border-box'
                height='100%'
                width='90%'
                display='block'
            >
                <Box
                    component='div'
                    height='100%'
                    width='100%'
                    position='relative'
                    display='block'
                >
                    <Box
                        component='div'
                        marginLeft='2px'
                        marginRight='2px'
                        zIndex='3'
                        display='block'
                        marginTop='-20px'
                        overflow='hidden'
                        position='absolute'
                        top='7%'
                        right='0'
                        sx={{ opacity: '1' }}
                    >
                        <IconButton sx={{ color: '#FFFFFF' }}>
                            <Close />
                        </IconButton>
                    </Box>
                    <Box
                        component='div'
                        marginLeft='2px'
                        marginRight='2px'
                        zIndex='3'
                        display='block'
                        marginTop='-20px'
                        overflow='hidden'
                        position='absolute'
                        top='50%'
                        left='0'
                        sx={{ opacity: '1' }}
                    >
                        <IconButton sx={{ color: '#FFFFFF', transform: 'rotate(90deg)' }}>
                            <ExpandCircleDown fontSize='large'/>
                        </IconButton>
                    </Box>
                    <Box
                        component='div'
                        marginLeft='2px'
                        marginRight='2px'
                        zIndex='3'
                        display='block'
                        marginTop='-20px'
                        overflow='hidden'
                        position='absolute'
                        top='50%'
                        right='0'
                        sx={{ opacity: '1' }}
                    >
                        <IconButton sx={{ color: '#FFFFFF', transform: 'rotate(-90deg)' }}>
                            <ExpandCircleDown fontSize='large'/>
                        </IconButton>
                    </Box>
                </Box>
            </Box>
            <Box
                component='div'
                width='80%'
            >
                <Box
                    component='div'
                    justifyContent='center'
                    minWidth='0'
                    boxSizing='border-box'
                    display='flex'
                    minHeight='0'
                    alignItems='flex-start'
                >
                    <Box
                        component='div'
                        justifyContent='center'
                        width='100%'
                        flexDirection='column'
                        display='flex'
                        alignItems='center'
                        height='100%'
                        position='relative'
                        zIndex='0'
                        margin='0'
                        overflow='hidden'
                        boxSizing='content-box'
                    >
                        <Box
                            component='div'
                            width='100%'
                            position='relative'
                            flexShrink='1'
                            margin='0'
                            maxHeight='100%-40px'
                            display='block'
                        >
                            <Box>
                                <Box
                                    component='div'
                                    width='100%'
                                    margin='auto'
                                    maxHeight='calc(100vh-40px)'
                                    maxWidth='calc(100%-128px)'
                                    overflow='auto'
                                    sx={{ borderBottomRightRadius: '4px', borderTopRightRadius: '4px', borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px' }}
                                    display='block'
                                >
                                    <Box
                                        component='div'
                                        display='flex'
                                        flexDirection='column'
                                        height='100%'
                                        maxWidth='100%'
                                        sx={{ pointerEvents: 'none' }}
                                    >
                                        <Box
                                            component='article'
                                            width='100%'
                                            maxHeight='inherit'
                                            padding='0'
                                            display='block'
                                            sx={{ pointerEvents: 'none' }}
                                        >
                                            <Box
                                                component='div'
                                                display='flex'
                                                flexDirection='row'
                                                justifyContent='center'
                                                alignItems='stretch'
                                                maxHeight='inherit'
                                                maxWidth='inherit'
                                                boxSizing='border-box'
                                                position='relative'
                                                sx={{ pointerEvents: 'none' }}
                                            >
                                                <VideoPlayer />
                                                <Comments />
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Backdrop>
    )
}