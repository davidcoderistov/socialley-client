import React from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import PostUserView from '../PostUserView'
import ImageDisplay from '../ImageDisplay'
import PostVideoPlayer from '../PostVideoPlayer'
import PostLikes from '../PostLikes'
import { FavoriteBorder } from '@mui/icons-material'
import { FollowedUserPost } from '../../types'


interface StaticProps {
    post: FollowedUserPost
    loading?: never
    onClickUser: (userId: string) => void
    onFollowUser: (userId: string) => void
}

interface LoadingProps {
    post?: never
    loading: true
    onClickUser?: never
    onFollowUser?: never
}

type Props = StaticProps | LoadingProps

export default function Post (props: Props) {

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
                    { props.loading ? (
                        <PostUserView loading />
                    ) : (
                        <PostUserView
                            post={{
                                title: props.post.title,
                                createdAt: props.post.createdAt,
                            }}
                            user={{
                                _id: props.post.user._id,
                                firstName: props.post.user.firstName,
                                lastName: props.post.user.lastName,
                                username: props.post.user.username,
                                avatarURL: props.post.user.avatarURL,
                                following: true,
                                pendingFollow: false,
                            }}
                            showAgo
                            dense
                            onClickUser={props.onClickUser}
                            onFollow={props.onFollowUser}
                            onClickMore={() => {}}
                        />
                    )}
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
                    { !props.loading ? props.post.videoURL ? (
                        <PostVideoPlayer minHeight={300} />
                    ) : (
                        <ImageDisplay
                            url={props.post.photoURL}
                            aspectRatioPercentage={100} />
                    ) : null }
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
                            minWidth='495px'
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
                            { !props.loading && props.post.likesCount > 0 && props.post.firstLikeUser && (
                                <Box
                                    component='section'
                                    marginBottom='8px'
                                    display='block'
                                >
                                    <PostLikes
                                        postId={props.post._id}
                                        user={props.post.firstLikeUser}
                                        likesCount={props.post.likesCount} />
                                </Box>
                            )}
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
                                    { !props.loading && props.post.commentsCount > 0 && (
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
                                                { props.post.commentsCount > 1 ?
                                                    `View all ${props.post.commentsCount} comments` : 'View 1 comment' }
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
