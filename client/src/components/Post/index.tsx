import React from 'react'
import Box from '@mui/material/Box'
import PostUserView from '../PostUserView'
import ImageDisplay from '../ImageDisplay'
import PostVideoPlayer from '../PostVideoPlayer'
import PostActions from '../PostActions'
import PostLikes from '../PostLikes'
import { FollowedUserPost } from '../../types'


interface StaticProps {
    post: FollowedUserPost
    loading?: never
    onClickUser: (userId: string) => void
    onFollowUser: (userId: string) => void
    onLikePost: (postId: string, liked: boolean) => void
    onViewPost: (postId: string) => void
    onBookmarkPost: (postId: string, favorite: boolean) => void
    onViewComments: (postId: string) => void
}

interface LoadingProps {
    post?: never
    loading: true
    onClickUser?: never
    onFollowUser?: never
    onLikePost?: never
    onViewPost?: never
    onBookmarkPost?: never
    onViewComments?: never
}

type Props = StaticProps | LoadingProps

export default function Post (props: Props) {

    const handleClickViewComments = () => {
        if (!props.loading) {
            props.onViewComments(props.post._id)
        }
    }

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
                        <PostUserView
                            loading
                            dense />
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
                                isFollowingLoading: false,
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
                    ) : (
                        <ImageDisplay
                            url={''}
                            aspectRatioPercentage={100} />
                    ) }
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
                            { !props.loading && (
                                <PostActions
                                    component='section'
                                    marginTop='4px'
                                    display='flex'
                                    flexDirection='row'
                                    borderTop='1px solid #262626'
                                    margin='0'
                                    paddingBottom='8px'
                                    paddingTop='6px'
                                    post={props.post}
                                    onLikePost={props.onLikePost}
                                    onViewPost={props.onViewPost}
                                    onBookmarkPost={props.onBookmarkPost} />
                            )}
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
                                                onClick={handleClickViewComments}
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
