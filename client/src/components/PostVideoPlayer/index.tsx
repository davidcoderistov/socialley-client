import React from 'react'
import Box from '@mui/material/Box'
import { default as _ReactPlayer } from 'react-player/lazy'
import { ReactPlayerProps } from 'react-player/types/lib'


const ReactPlayer = _ReactPlayer as unknown as React.FC<ReactPlayerProps>

export default function PostVideoPlayer (props: { minHeight?: number }) {

    return (
        <Box
            component='div'
            maxHeight='100%'
            maxWidth='100%'
            flexBasis='100%'
            bgcolor='#000000'
            flexGrow='1'
            minHeight={props.minHeight ?? 450}
            overflow='hidden'
            flexShrink='1'
            display='flex'
            flexDirection='column'
            justifyContent='center'
            position='relative'
            sx={{ pointerEvents: 'none' }}
        >
            <Box
                component='div'
                display='block'
            >
                <Box
                    component='div'
                    display='block'
                    paddingBottom='89.25%'
                    position='relative'
                >
                    <Box
                        component='div'
                        display='block'
                        width='100%'
                        height='100%'
                        bgcolor='#000000'
                        position='absolute'
                    >
                        <Box
                            component='div'
                            display='block'
                            width='100%'
                            height='100%'
                            position='relative'
                            zIndex='0'
                        >
                            <Box
                                component='div'
                                display='block'
                                width='100%'
                                height='100%'
                                position='relative'
                            >
                                <Box
                                    component='div'
                                    display='block'
                                    width='100%'
                                    height='100%'
                                    position='relative'
                                >
                                    <Box
                                        component='div'
                                        display='block'
                                        width='100%'
                                        height='100%'
                                        position='static'
                                    >
                                        <ReactPlayer
                                            width='100%'
                                            height='100%'
                                            url='https://www.youtube.com/watch?v=4WT5cMFySHg'
                                            playing={false} />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}