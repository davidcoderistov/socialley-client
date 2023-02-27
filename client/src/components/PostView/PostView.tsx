import React from 'react'
import Box from '@mui/material/Box'
import Backdrop from '@mui/material/Backdrop'
import IconButton from '@mui/material/IconButton'
import { Close } from '@mui/icons-material'
import ImageDisplay from '../ImageDisplay'
import PostVideoPlayer from '../PostVideoPlayer'
import PostDetails from './PostDetails'
import { PostDetails as PostDetailsI } from '../../types'
import { Comment } from '../../graphql/types/models'


const IMAGE_POST_CONTAINER_WIDTH = 66
const VIDEO_POST_CONTAINER_WIDTH = 75

interface Props {
    postDetails: PostDetailsI | null
    isPostDetailsLoading: boolean
    onClickUser: (userId: string) => void
    onFollowUser: (userId: string) => void
    onLikePost: (postId: string, liked: boolean) => void
    onBookmarkPost: (postId: string, favorite: boolean) => void
    comments: Comment[]
    hasMoreComments: boolean
    commentsLoading: boolean
    onFetchMoreComments: () => void
    onLikeComment: (commentId: string, postId: string, liked: boolean) => void
    onPostComment: (comment: string) => void
    isCommentPosting: boolean
    onClose: () => void
}

export default function PostView (props: Props) {

    const isImg = !props.postDetails?.videoURL

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
                        <IconButton sx={{ color: '#FFFFFF' }} onClick={props.onClose}>
                            <Close />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
            <Box
                component='div'
                width={`${isImg ? IMAGE_POST_CONTAINER_WIDTH : VIDEO_POST_CONTAINER_WIDTH}%`}
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
                                                { !props.isPostDetailsLoading && props.postDetails ? props.postDetails.videoURL ? (
                                                    <PostVideoPlayer minHeight={300} />
                                                ) : (
                                                    <ImageDisplay
                                                        url={props.postDetails.photoURL} />
                                                ) : (
                                                    <ImageDisplay
                                                        url={''}
                                                        aspectRatioPercentage={100} />
                                                ) }
                                                <PostDetails
                                                    postDetails={props.postDetails ?? null}
                                                    isPostDetailsLoading={props.isPostDetailsLoading}
                                                    onClickUser={props.onClickUser}
                                                    onFollowUser={props.onFollowUser}
                                                    onLikePost={props.onLikePost}
                                                    onBookmarkPost={props.onBookmarkPost}
                                                    comments={props.comments}
                                                    hasMoreComments={props.hasMoreComments}
                                                    commentsLoading={props.commentsLoading}
                                                    onFetchMoreComments={props.onFetchMoreComments}
                                                    onLikeComment={props.onLikeComment}
                                                    isCommentPosting={props.isCommentPosting}
                                                    onPostComment={props.onPostComment} />
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