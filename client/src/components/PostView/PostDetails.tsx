import React from 'react'
import Box from '@mui/material/Box'
import PostUserView from '../PostUserView'
import PostComments from '../PostView/PostComments'
import PostActions from '../PostActions'
import PostLikes from '../PostLikes'
import PostAddComment from '../PostView/PostAddComment'
import { PostDetails as PostDetailsI, Comment } from '../../types'
import moment from 'moment'


interface Props {
    postDetails: PostDetailsI | null
    isPostDetailsLoading: boolean
    onClickUser: (userId: string) => void
    onFollowUser: (userId: string) => void
    onLikePost: (postId: string, liked: boolean) => void
    onViewPost: (postId: string) => void
    onBookmarkPost: (postId: string, favorite: boolean) => void
    commentsLoading: boolean
    comments: Comment[]
    onLikeComment: (commentId: string, postId: string, liked: boolean) => void
}

export default function PostDetails (props: Props) {

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
                        { props.isPostDetailsLoading ? (
                            <PostUserView loading={true} />
                        ) : props.postDetails ? (
                            <PostUserView
                                post={props.postDetails}
                                user={props.postDetails.user}
                                onClickUser={props.onClickUser}
                                onFollow={props.onFollowUser}
                                onClickMore={() => {}}
                            />
                        ) : null}
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
                        { !props.isPostDetailsLoading && props.postDetails && (
                            <PostActions
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
                                post={props.postDetails}
                                onLikePost={props.onLikePost}
                                onViewPost={props.onViewPost}
                                onBookmarkPost={props.onBookmarkPost} />
                        )}
                        { !props.isPostDetailsLoading && props.postDetails && props.postDetails.likesCount > 0 && props.postDetails.firstLikeUser && (
                            <Box
                                component='section'
                                paddingLeft='16px'
                                paddingRight='16px'
                                marginBottom='4px'
                                display='block'
                                order='4'
                            >
                                <PostLikes
                                    postId={props.postDetails._id}
                                    user={props.postDetails.firstLikeUser}
                                    likesCount={props.postDetails.likesCount} />
                            </Box>
                        )}
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
                                comments={props.comments}
                                onLikeComment={props.onLikeComment} />
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
                                            { !props.isPostDetailsLoading && props.postDetails &&
                                                moment(props.postDetails.createdAt).format('MMMM D, YYYY')}
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