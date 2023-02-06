import React from 'react'
import Box from '@mui/material/Box'
import Comment from '../Comment'


interface CommentI {
    _id: string
    user: {
        _id: string
        firstName: string
        lastName: string
        username: string
        avatarURL?: string | null
    }
    text: string
    likes: number
    liked: boolean
    createdAt: number
}

interface Props {
    comments: CommentI[]
    onLikeComment: (comment: CommentI) => void
}

export default function PostComments (props: Props) {

    return props.comments.length > 0 ? (
        <Box
            component='ul'
            border='0'
            boxSizing='content-box'
            flexGrow='1'
            fontSize='100%'
            height='calc(100%-32px)'
            left='0'
            margin='0'
            padding='16px'
            position='absolute'
            width='calc(100%-32px)'
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