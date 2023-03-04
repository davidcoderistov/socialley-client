import React, { useMemo } from 'react'
import { useInfiniteScroll } from '../../hooks/misc'
import Box, { BoxProps } from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import MediaDisplay from '../MediaDisplay'
import _range from 'lodash/range'


interface Post {
    _id: string
    photoURL: string
    videoURL: string | null
}

interface PostsFeedProps {
    boxProps?: BoxProps
    posts: Post[]
    isPostsLoading: boolean
    hasMorePosts: boolean
    onFetchMorePosts: () => void
    onClickPost: (postId: string) => void
    dense?: boolean
}

export default function PostsFeed ({ boxProps = {}, posts, isPostsLoading, hasMorePosts, onFetchMorePosts, onClickPost, dense = false }: PostsFeedProps) {

    const postItems = useMemo(() => {
        if (isPostsLoading) {
            return _range(dense ? 3 : 6).map(index => ({ _id: index.toString(), url: '' }))
        }
        return posts.map(post => ({
            _id: post._id,
            url: post.photoURL,
        }))
    }, [posts, isPostsLoading])

    const handleFetchMorePosts = () => {
        onFetchMorePosts()
    }

    const infiniteScrollRef = useInfiniteScroll<HTMLDivElement>(handleFetchMorePosts)

    return (
        <Box component='div' {...boxProps}>
            <MediaDisplay
                items={postItems}
                minHeight={0}
                onClick={onClickPost} />
            { !isPostsLoading && posts.length <= 0 && (
                <Box
                    component='div'
                    display='flex'
                    flexDirection='column'
                    justifyContent='center'
                    alignItems='center'
                    marginTop='100px'
                    color='#A8A8A8'
                >
                    No posts yet
                </Box>
            )}
            { hasMorePosts && (
                <Box
                    ref={infiniteScrollRef}
                    component='div'
                    display='flex'
                    flexDirection='row'
                    justifyContent='center'
                    alignItems='flex-start'
                    height='60px'
                    marginY='20px'
                >
                    <CircularProgress size={30} sx={{ color: '#FFFFFF', mt: 1 }} />
                </Box>
            )}
        </Box>
    )
}