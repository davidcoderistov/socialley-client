import React from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import PostUserView from '../PostUserView'
import PostImage from '../PostImage'
import PostVideoPlayer from '../PostVideoPlayer'
import PostLikes from '../PostLikes'
import { FavoriteBorder } from '@mui/icons-material'



const isImg = true

export default function Post () {

    return (
        <Box
            component='div'
            display='block'
            maxHeight='inherit'
            padding='0'
            marginBottom='12px'
            paddingBottom='20px'
            borderRadius='0'
            borderBottom='1px solid #262626'
        >
            <Box
                component='div'
                maxHeight='inherit'
                maxWidth='inherit'
                justifyContent='center'
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
                        }}
                        loading={false}
                        showAgo
                        dense
                        onClickUser={() => {}}
                        onFollow={() => {}}
                        onClickMore={() => {}}
                    />
                </Box>
                <Box
                    component='div'
                    borderRadius='4px'
                    overflow='hidden'
                    border='1px solid #262626'
                    bgcolor='#000000'
                    display='flex'
                    flexDirection='column'
                    position='relative'
                >
                    { isImg ? (
                        <PostImage />
                    ) : (
                        <PostVideoPlayer minHeight={300} />
                    )}
                </Box>
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
                        display='flex'
                        flexDirection='column'
                        position='relative'
                        borderRadius='8px'
                        bgcolor='#000000'
                    >
                        <Box
                            component='div'
                            border='none'
                            padding='0'
                            boxSizing='border-box'
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
                                borderTop='1px solid #262626'
                                margin='0'
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
                                marginBottom='8px'
                                display='block'
                            >
                                <PostLikes user={{_id: '1', username: 'random8273' }} />
                            </Box>
                            <Box
                                component='div'
                                margin='0 0 auto'
                                display='flex'
                                flexDirection='column'
                                flexGrow='1'
                                flexShrink='1'
                                minHeight='0'
                                overflow='hidden'
                                position='relative'
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
                                        marginBottom='8px'
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
                                            component='span'
                                            color='#A8A8A8'
                                            fontWeight='400'
                                            fontSize='14px'
                                            lineHeight='18px'
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            View all 111 comments
                                        </Box>
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
