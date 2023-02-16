import React from 'react'
import Box, { BoxProps } from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { Reply } from '@mui/icons-material'
import { Bookmark, BookmarkBorder } from '@mui/icons-material'


interface Props extends BoxProps {
    post: {
        _id: string
        liked: boolean
        favorite: boolean
    }
    onLikePost: (postId: string) => void
    onViewPost: (postId: string) => void
    onBookmarkPost: (postId: string) => void
}

export default function PostActions ({ post, onLikePost, onViewPost, onBookmarkPost, ...boxProps }: Props) {

    const handleLikePost = () => {
        onLikePost(post._id)
    }

    const handleViewPost = () => {
        onViewPost(post._id)
    }

    const handleBookmarkPost = () => {
        onBookmarkPost(post._id)
    }

    return (
        <Box {...boxProps}>
            <Box
                component='span'
                display='inline-block'
                marginLeft='-8px'
            >
                <IconButton sx={{ color: post.liked ? '#ED4956' : '#FFFFFF' }} onClick={handleLikePost}>
                    { post.liked ? (
                        <Favorite sx={{ fontSize: 28 }}/>
                    ) : (
                        <FavoriteBorder sx={{ fontSize: 28 }}/>
                    )}
                </IconButton>
            </Box>
            <Box
                component='span'
                display='inline-block'
                marginLeft='-8px'
            >
                <IconButton sx={{ color: '#FFFFFF' }} onClick={handleViewPost}>
                    <Reply sx={{ fontSize: 28 }}/>
                </IconButton>
            </Box>
            <Box
                component='span'
                display='inline-block'
                margin='0'
                padding='0'
                marginLeft='auto'
                marginRight='-10px'
                sx={{ verticalAlign: 'baseline' }}
            >
                <IconButton sx={{ color: '#FFFFFF' }} onClick={handleBookmarkPost}>
                    { post.favorite ? (
                        <Bookmark sx={{ fontSize: 28 }}/>
                    ) : (
                        <BookmarkBorder sx={{ fontSize: 28 }}/>
                    )}
                </IconButton>
            </Box>
        </Box>
    )
}