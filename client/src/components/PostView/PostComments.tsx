import React from 'react'
import Box from '@mui/material/Box'
import Comment from '../Comment'
import { Comment as CommentI } from '../../types'


interface Props {
    comments: CommentI[]
    onLikeComment: (commentId: string) => void
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
            { props.comments.map(comment => (
                <Comment
                    key={comment._id}
                    comment={comment}
                    onLikeComment={props.onLikeComment} />
            ))}
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