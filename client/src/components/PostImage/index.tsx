import React from 'react'
import Box from '@mui/material/Box'


export default function PostImage () {

    return (
        <Box
            component='div'
            maxHeight='100%'
            maxWidth='100%'
            flexBasis='100%'
            bgcolor='#000000'
            flexGrow='1'
            justifyContent='center'
            minHeight='450px'
            overflow='hidden'
            flexShrink='1'
            display='flex'
            flexDirection='column'
            position='relative'
            sx={{ pointerEvents: 'none' }}
        >
            <Box
                component='div'
                padding='0'
                flexDirection='column'
                boxSizing='border-box'
                display='flex'
                flexShrink='0'
                alignItems='stretch'
                position='relative'
                margin='0'
                border='0'
                sx={{ verticalAlign: 'baseline' }}
            >
                <Box
                    component='div'
                    display='block'
                >
                    <Box
                        component='div'
                        maxHeight='inherit'
                        bgcolor='#262626'
                        display='block'
                        width='100%'
                        position='relative'
                    >
                        <Box
                            component='div'
                            display='block'
                            position='relative'
                            overflow='hidden'
                            paddingBottom='125%'
                        >
                            <Box
                                component='img'
                                width='100%'
                                height='100%'
                                position='absolute'
                                top='0'
                                left='0'
                                border='0'
                                overflow='clip'
                                fontSize='100%'
                                src='https://media.licdn.com/dms/image/C4E05AQFICc_xz7x_iA/feedshare-thumbnail_720_1280/0/1665680607798?e=2147483647&v=beta&t=uoEANNkcoYgIGueDpxdzfh-iF5Rg625ERQ8gqkbfkc8'
                                sx={{ objectFit: 'cover', overflowClipMargin: 'content-box' }}
                            />
                        </Box>
                        <Box
                            component='div'
                            display='block'
                            position='absolute'
                            top='0'
                            bottom='0'
                            right='0'
                            left='0'
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}