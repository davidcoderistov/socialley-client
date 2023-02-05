import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import UserAvatar from '../UserAvatar'
import { FavoriteBorder } from '@mui/icons-material'


export default function Comments () {

    return (
        <Box
            component='div'
            alignItems='stretch'
            border='0'
            boxSizing='border-box'
            display='flex'
            flexDirection='column'
            flexGrow='1'
            flexShrink='2'
            margin='0'
            maxWidth='800px'
            minWidth='495px'
            padding='0'
            position='relative'
            sx={{ verticalAlign: 'baseline' }}
        >
            <Box
                component='div'
                flex='1 1 auto'
                minHeight='0'
                minWidth='0'
                justifyContent='flex-start'
                flexDirection='column'
                alignItems='stretch'
                display='flex'
                boxSizing='border-box'
                position='relative'
            >
                <Box
                    component='div'
                    borderRadius='0 4px 4px 0'
                    display='flex'
                    flexDirection='column'
                    position='relative'
                    bgcolor='#000000'
                    height='100%'
                    sx={{ pointerEvents: 'auto' }}
                >
                    <Box
                        component='div'
                        borderLeft='1px solid #262626'
                        bgcolor='#000000'
                        borderBottom='1px solid #262626'
                        marginRight='0'
                        borderRadius='4px'
                        display='block'
                    >
                        <Box
                            component='div'
                            flex='0 0 auto'
                            justifyContent='space-between'
                            flexDirection='row'
                            alignItems='center'
                            alignContent='stretch'
                            display='flex'
                            boxSizing='border-box'
                            position='relative'
                        >
                            <Box
                                component='header'
                                alignItems='center'
                                boxSizing='border-box'
                                display='flex'
                                flexDirection='row'
                                flexGrow='1'
                                flexShrink='1'
                                maxWidth='calc(100% - 48px)'
                                padding='14px 4px 14px 16px'
                                position='relative'
                            >
                                <UserAvatar
                                    size={30}
                                    fontSize={14}
                                    firstName='David'
                                    lastName='Ristov' />
                                <Box
                                    component='div'
                                    marginLeft='14px'
                                    alignItems='flex-start'
                                    boxSizing='border-box'
                                    display='flex'
                                    flexDirection='column'
                                    flexGrow='1'
                                    flexShrink='1'
                                    overflow='hidden'
                                    position='relative'
                                >
                                    <Box
                                        component='div'
                                        maxWidth='100%'
                                        alignItems='baseline'
                                        display='flex'
                                        flexDirection='row'
                                        position='relative'
                                    >
                                        <Box
                                            component='div'
                                            display='flex'
                                        >
                                            <Box
                                                component='div'
                                                boxSizing='border-box'
                                                flexGrow='1'
                                                flexShrink='1'
                                                fontSize='100%'
                                                margin='0'
                                                maxWidth='100%'
                                                overflow='hidden'
                                                padding='2px'
                                                position='relative'
                                                top='1px'
                                                sx={{ verticalAlign: 'baseline' }}
                                            >
                                                <Box
                                                    component='div'
                                                    flex='0 0 auto'
                                                    justifyContent='flex-start'
                                                    flexDirection='row'
                                                    alignItems='center'
                                                    alignContent='stretch'
                                                    display='flex'
                                                    boxSizing='border-box'
                                                    position='relative'
                                                >
                                                    <Box
                                                        component='div'
                                                        display='block'
                                                        color='#FFFFFF'
                                                        fontWeight='600'
                                                        margin='0'
                                                        fontSize='14px'
                                                        lineHeight='18px'
                                                    >
                                                        <Box
                                                            component='div'
                                                            display='inline'
                                                        >
                                                            <Box
                                                                component='span'
                                                                display='inline'
                                                                position='relative'
                                                            >
                                                                wealthslayers
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Box
                                            component='div'
                                            alignItems='baseline'
                                            border='0'
                                            boxSizing='border-box'
                                            display='flex'
                                            flexDirection='row'
                                            flexShrink='0'
                                            fontSize='100%'
                                            margin='0'
                                            padding='0'
                                            position='relative'
                                            top='1px'
                                            sx={{ verticalAlign: 'baseline' }}
                                        >
                                            <Box
                                                component='div'
                                                alignItems='stretch'
                                                border='0'
                                                boxSizing='border-box'
                                                display='flex'
                                                flexDirection='column'
                                                flexShrink='0'
                                                fontSize='100%'
                                                margin='0'
                                                marginRight='2px'
                                                padding='0'
                                                position='relative'
                                                sx={{ verticalAlign: 'baseline' }}
                                            >
                                                <Box
                                                    component='span'
                                                    marginLeft='4px'
                                                    marginRight='4px'
                                                    color='#FFFFFF'
                                                    display='inline'
                                                >
                                                    &middot;
                                                </Box>
                                            </Box>
                                            <Button
                                                variant='text'
                                                color='primary'
                                                sx={{ textTransform: 'none' }}
                                            >Follow</Button>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box
                        component='div'
                        borderLeft='1px solid #262626'
                        padding='0'
                        boxSizing='border-box'
                        flexGrow='1'
                        display='flex'
                        flexDirection='column'
                        minWidth='335px'
                        position='relative'
                        width='100%'
                    >
                        <Box
                            component='section'
                            marginTop='4px'
                            display='flex'
                            flexDirection='row'
                            paddingLeft='16px'
                            paddingRight='16px'
                            borderTop='1px solid #262626'
                            margin='0'
                            order='3'
                            paddingBottom='8px'
                            paddingTop='6px'
                        >
                            <Box
                                component='span'
                                display='inline-block'
                                marginLeft='-8px'
                            >
                                <IconButton sx={{ color: '#FFFFFF' }}>
                                    <FavoriteBorder />
                                </IconButton>
                            </Box>
                        </Box>
                        <Box
                            component='section'
                            paddingLeft='16px'
                            paddingRight='16px'
                            marginBottom='4px'
                            display='block'
                            order='4'
                        >
                            <Box
                                component='div'
                                minHeight='0'
                                minWidth='0'
                                justifyContent='flex-start'
                                flexDirection='row'
                                alignItems='stretch'
                                alignContent='stretch'
                                display='flex'
                                boxSizing='border-box'
                                position='relative'
                            >
                                <Box
                                    component='div'
                                    margin='auto'
                                    flexWrap='wrap'
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
                                        color='#FFFFFF'
                                        margin='0'
                                        fontWeight='400'
                                        fontSize='14px'
                                        lineHeight='18px'
                                    >
                                        <span>Liked by </span>
                                        <span>kruz_stewart</span>
                                        <span> and others</span>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box
                            component='div'
                            margin='0 0 auto'
                            padding='0 16px'
                            order='1'
                            display='flex'
                            flexDirection='column'
                            flexGrow='1'
                            flexShrink='1'
                            minHeight='0'
                            position='relative'
                            sx={{ overflowX: 'hidden', overflowY: 'auto' }}
                        >
                            <Box
                                component='ul'
                                fontSize='100%'
                                margin='0'
                                border='0'
                                padding='0'
                                marginBottom='16px'
                                display='block'
                                sx={{ verticalAlign: 'baseline', listStyleType: 'none' }}
                            >
                                <Box
                                    component='div'
                                    flexDirection='column'
                                    boxSizing='border-box'
                                    display='flex'
                                    flexShrink='0'
                                    alignItems='stretch'
                                    position='relative'
                                    fontSize='100%'
                                    margin='0'
                                    border='0'
                                    padding='0'
                                    sx={{ verticalAlign: 'baseline' }}
                                >
                                    <Box
                                        component='li'
                                        paddingBottom='0'
                                        overflow='visible'
                                        padding='12px 0'
                                        width='auto'
                                        marginRight='-2px'
                                        marginTop='-5px'
                                        position='relative'
                                        display='list-item'
                                        sx={{ wordWrap: 'break-word', textAlign: '-webkit-match-parent' }}
                                    >
                                        <Box
                                            component='div'
                                            alignItems='flex-start'
                                            border='0'
                                            boxSizing='border-box'
                                            display='flex'
                                            flexDirection='row'
                                            fontSize='100%'
                                            flexShrink='0'
                                            justifyContent='space-between'
                                            margin='0'
                                            padding='0'
                                            position='relative'
                                            sx={{ verticalAlign: 'baseline' }}
                                        >
                                            <Box
                                                component='div'
                                                alignItems='flex-start'
                                                display='flex'
                                                flexDirection='row'
                                                width='100% - 28px'
                                            >
                                                <UserAvatar
                                                    size={30}
                                                    fontSize={14}
                                                    firstName='David'
                                                    lastName='Ristov' />
                                                <Box
                                                    component='div'
                                                    border='0'
                                                    boxSizing='border-box'
                                                    display='inline-block'
                                                    flexShrink='1'
                                                    fontSize='100%'
                                                    margin='0'
                                                    minWidth='0'
                                                    padding='0'
                                                    position='relative'
                                                    marginLeft='14px'
                                                    sx={{ verticalAlign: 'baseline' }}
                                                >
                                                    <Box
                                                        component='h3'
                                                        alignItems='center'
                                                        display='inline-flex'
                                                        color='#FFFFFF'
                                                        fontSize='13px'
                                                        fontWeight='600'
                                                        margin='0'
                                                        padding='0'
                                                    >
                                                        <Box
                                                            component='div'
                                                            marginRight='4px'
                                                            flex='0 0 auto'
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
                                                                display='inline'
                                                            >
                                                                <Box
                                                                    component='span'
                                                                    display='inline'
                                                                    position='relative'
                                                                >
                                                                    joulane4356
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                    <Box
                                                        component='div'
                                                        display='inline'
                                                    >
                                                        <Box
                                                            component='span'
                                                            display='inline!important'
                                                            margin='0!important'
                                                            color='#FFFFFF'
                                                            fontWeight='400'
                                                            fontSize='14px'
                                                            lineHeight='18px'
                                                        >
                                                            Free the brothers. It is very clear that they are innocent.
                                                        </Box>
                                                    </Box>
                                                    <Box
                                                        component='div'
                                                        marginTop='8px'
                                                        marginBottom='4px'
                                                        flex='0 0 auto'
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
                                                            color='#A8A8A8'
                                                            fontWeight='400'
                                                            fontSize='12px'
                                                            lineHeight='16px'
                                                            margin='-2px 0 -3px'
                                                        >
                                                            <Box
                                                                component='span'
                                                                display='inline-block'
                                                                marginRight='4px'
                                                            >
                                                                3d
                                                            </Box>
                                                            <Box
                                                                component='span'
                                                                display='inline-block'
                                                                marginRight='4px'
                                                            >
                                                                &middot;
                                                            </Box>
                                                            <Box
                                                                component='span'
                                                                display='inline-block'
                                                                marginRight='4px'
                                                            >
                                                                65 likes
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Box
                                                component='span'
                                                marginTop='9px'
                                            >
                                                <Box
                                                    component='div'
                                                    bgcolor='transparent'
                                                    border='none'
                                                    padding='0'
                                                >
                                                    <IconButton sx={{ color: '#FFFFFF' }}>
                                                        <FavoriteBorder sx={{ fontSize: '16px' }} />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box
                            component='div'
                            paddingLeft='16px'
                            order='5'
                            marginBottom='16px'
                            display='block'
                        >
                            <Box
                                component='div'
                                justifyContent='flex-start'
                                flexDirection='row'
                                alignItems='center'
                                alignContent='stretch'
                                display='flex'
                                boxSizing='border-box'
                                position='relative'
                            >
                                <Box
                                    component='div'
                                    display='block'
                                    color='#A8A8A8'
                                    fontWeight='400'
                                    margin='0'
                                    fontSize='14px'
                                    lineHeight='18px'
                                    textTransform='uppercase'
                                >
                                    <Box
                                        component='div'
                                        display='inline!important'
                                        margin='0!important'
                                        color='#A8A8A8'
                                        fontWeight='400'
                                        fontSize='10px'
                                        lineHeight='12px'
                                    >
                                        <Box
                                            component='time'
                                            letterSpacing='.2px'
                                        >
                                            November 3, 2022
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box
                            component='section'
                            paddingRight='16px'
                            order='6'
                            paddingBottom='6px'
                            paddingTop='6px'
                            borderTop='1px solid #262626'
                            position='relative'
                            flexShrink='0'
                        >
                            <Box
                                component='div'
                                flex='0 0 auto'
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
                                    padding='20px'
                                    flex='0 0 auto'
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
                                        alignItems='center'
                                        border='1px solid #363636'
                                        borderRadius='22px'
                                        boxSizing='border-box'
                                        display='flex'
                                        flexDirection='row'
                                        flexShrink='0'
                                        margin='0'
                                        padding='0'
                                        minHeight='44px'
                                        paddingLeft='11px'
                                        paddingRight='8px'
                                        position='relative'
                                    >
                                        <Box
                                            component='div'
                                            marginRight='4px'
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
                                                placeholder='Add a comment...'
                                                fullWidth
                                            />
                                        </Box>
                                        <Button
                                            variant='text'
                                            sx={{ textTransform: 'none' }}
                                        >
                                            Post
                                        </Button>
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