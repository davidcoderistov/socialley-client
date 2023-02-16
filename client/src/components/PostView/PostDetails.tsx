import React from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { FavoriteBorder } from '@mui/icons-material'
import PostUserView from '../PostUserView'
import PostComments from '../PostView/PostComments'
import PostLikes from '../PostLikes'
import PostAddComment from '../PostView/PostAddComment'


export default function PostDetails () {

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
            maxWidth='600px'
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
                        borderBottom='1px solid #262626'
                        bgcolor='#000000'
                        marginRight='0'
                        borderRadius='4px'
                        display='block'
                    >
                        <PostUserView
                            post={{
                                title: 'Leeds',
                                createdAt: 1,
                            }}
                            user={{
                                _id: '1',
                                firstName: 'Jelena',
                                lastName: 'Braun',
                                username: 'jelena_braun',
                                avatarURL: null,
                                following: false,
                                pendingFollow: false,
                            }}
                            onClickUser={() => {}}
                            onFollow={() => {}}
                            onClickMore={() => {}}
                        />
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
                            <PostLikes user={{ _id: '1', username: 'random8723' }} likesCount={2} postId='asd' />
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
                            <PostComments
                                comments={[]}
                                onLikeComment={() => {}} />
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
                            <PostAddComment
                                comment={''}
                                postingComment={false}
                                onChangeComment={() => {}}
                                onPostComment={() => {}}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}