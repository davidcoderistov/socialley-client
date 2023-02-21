import React from 'react'
import Box from '@mui/material/Box'
import { AddCircleOutline } from '@mui/icons-material'
import Comment from '../Comment'
import LoadingIconButton from '../LoadingIconButton'
import { Comment as CommentI } from '../../types'


interface Props {
    comments: CommentI[]
    hasMoreComments: boolean
    moreCommentsLoading: boolean
    onFetchMoreComments: () => void
    onLikeComment: (commentId: string, postId: string, liked: boolean) => void
}

export default function PostComments (props: Props) {

    return props.comments.length > 0 ? (
        <Box
            component='ul'
            border='0'
            flexGrow='1'
            fontSize='100%'
            height='calc(100%-32px)'
            left='0'
            margin='0'
            padding='16px'
            position='absolute'
            width='100%'
            sx={{ overflowX: 'hidden', overflowY: 'auto', verticalAlign: 'baseline' }}
        >
            { props.comments.map((comment, index) => (
                <Comment
                    key={comment._id}
                    comment={comment}
                    dense={index === props.comments.length - 1}
                    onLikeComment={props.onLikeComment} />
            ))}
            { props.hasMoreComments && (
                <Box
                    component='li'
                    display='list-item'
                    sx={{ listStyleType: 'none' }}
                >
                    <Box
                        minHeight='40px'
                        position='relative'
                        justifyContent='center'
                        flexDirection='column'
                        alignItems='stretch'
                        display='flex'
                        boxSizing='border-box'
                    >
                        <LoadingIconButton
                            color='#FFFFFF'
                            loading={props.moreCommentsLoading}
                            iconComponent={<AddCircleOutline />}
                            onClick={props.onFetchMoreComments} />
                    </Box>
                </Box>
            )}
        </Box>
    ) : (
        <Box
            component='div'
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            height='100%'
            color='#A8A8A8'
        >
            No comments yet
        </Box>
    )
}