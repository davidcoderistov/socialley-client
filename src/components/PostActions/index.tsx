import React from 'react'
import Box, { BoxProps } from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { Reply } from '@mui/icons-material'
import { Bookmark, BookmarkBorder } from '@mui/icons-material'
import LoadingIconButton from '../LoadingIconButton'


interface Props extends BoxProps {
    post: {
        _id: string
        liked: boolean
        isLikedLoading: boolean
        favorite: boolean
        isFavoriteLoading: boolean
    }
    onLikePost: (postId: string, liked: boolean) => void
    onViewPost: (postId: string) => void
    onBookmarkPost: (postId: string, favorite: boolean) => void
}

export default function PostActions ({ post, onLikePost, onViewPost, onBookmarkPost, ...boxProps }: Props) {

    const handleLikePost = () => {
        onLikePost(post._id, !post.liked)
    }

    const handleViewPost = () => {
        onViewPost(post._id)
    }

    const handleBookmarkPost = () => {
        onBookmarkPost(post._id, !post.favorite)
    }

    return (
        <Box {...boxProps}>
            <Box
                component='span'
                display='inline-block'
                marginLeft='-8px'
            >
                <LoadingIconButton
                    color={post.liked ? '#ED4956' : '#FFFFFF'}
                    loading={post.isLikedLoading}
                    iconComponent={post.liked ? <Favorite sx={{ fontSize: 28 }}/> :  <FavoriteBorder sx={{ fontSize: 28 }}/>}
                    onClick={handleLikePost} />
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
                <LoadingIconButton
                    color='#FFFFFF'
                    loading={post.isFavoriteLoading}
                    iconComponent={post.favorite ? <Bookmark sx={{ fontSize: 28 }}/> : <BookmarkBorder sx={{ fontSize: 28 }}/>}
                    onClick={handleBookmarkPost} />
            </Box>
        </Box>
    )
}