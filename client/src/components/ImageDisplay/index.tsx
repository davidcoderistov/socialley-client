import React from 'react'
import Box from '@mui/material/Box'


interface StaticProps {
    url: string
    minHeight?: number
    bordered?: boolean
    tile?: boolean
}

interface ClickableProps extends StaticProps {
    clickable: true
    onClick: () => void
}

interface NonClickableProps extends StaticProps {
    clickable?: never
    onClick?: never
}

type Props = ClickableProps | NonClickableProps

export default function ImageDisplay ({ url, minHeight = 450, bordered = false, tile = true, clickable, onClick }: Props) {

    const handleClick = () => {
        if (clickable && onClick) {
            onClick()
        }
    }

    return (
        <Box
            component='div'
            maxHeight='100%'
            maxWidth='100%'
            flexBasis='100%'
            bgcolor='#000000'
            flexGrow='1'
            justifyContent='center'
            minHeight={minHeight}
            overflow='hidden'
            flexShrink='1'
            display='flex'
            flexDirection='column'
            position='relative'
            border={bordered ? '2px solid #FFFFFF' : '0'}
            sx={{
                ...clickable && { cursor: 'pointer' },
                ...!tile && { borderRadius: '10px' }
            }}
            onClick={handleClick}
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
                                src={url}
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