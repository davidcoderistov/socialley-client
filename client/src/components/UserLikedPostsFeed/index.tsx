import React, { useState, useEffect, useMemo } from 'react'
import { useLazyQuery } from '@apollo/client'
import { GET_LIKED_POSTS_FOR_USER } from '../../graphql/queries/posts'
import { GetLikedPostsForUserQueryType } from '../../graphql/types/queries/posts'
import { BoxProps } from '@mui/material/Box'
import PostsFeed from '../PostsFeed'
import PostDetailsView from '../PostDetailsView'


interface UserPostsFeedProps {
    boxProps?: BoxProps
    dense?: boolean
    shouldSkipQuery?: boolean
}

export default function UserLikedPostsFeed ({ boxProps = {}, dense = false, shouldSkipQuery = false }: UserPostsFeedProps) {

    const [viewingPostId, setViewingPostId] = useState<string | null>(null)

    const [getUserLikedPosts, userLikedPosts] = useLazyQuery<GetLikedPostsForUserQueryType>(GET_LIKED_POSTS_FOR_USER)

    useEffect(() => {
        if (!shouldSkipQuery && !userLikedPosts.called) {
            getUserLikedPosts({ variables: { offset: 0, limit: 10 } })
        }
    }, [shouldSkipQuery])

    const posts = useMemo(() => {
        if (userLikedPosts.data) {
            return userLikedPosts.data.getLikedPostsForUser.data
        }
        return []
    }, [userLikedPosts.data])

    const hasMorePosts = useMemo(() => {
        if (userLikedPosts.loading || userLikedPosts.error || !userLikedPosts.data) {
            return false
        }
        return posts.length < userLikedPosts.data.getLikedPostsForUser.total
    }, [posts, userLikedPosts.loading, userLikedPosts.error])

    const handleFetchMorePosts = () => {
        userLikedPosts.fetchMore({
            variables: { offset: posts.length },
            updateQuery (existing, { fetchMoreResult } : { fetchMoreResult: GetLikedPostsForUserQueryType }) {
                return {
                    ...existing,
                    getLikedPostsForUser: {
                        ...existing.getLikedPostsForUser,
                        data: [
                            ...existing.getLikedPostsForUser.data,
                            ...fetchMoreResult.getLikedPostsForUser.data,
                        ]
                    }
                }
            }
        })
    }

    const handleClickPost = (postId: string) => {
        setViewingPostId(postId)
    }

    const handleCloseViewPost = () => {
        setViewingPostId(null)
    }

    return (
        <>
            <PostsFeed
                boxProps={boxProps}
                dense={dense}
                posts={posts}
                isPostsLoading={userLikedPosts.loading}
                hasMorePosts={hasMorePosts}
                onFetchMorePosts={handleFetchMorePosts}
                onClickPost={handleClickPost} />
            <PostDetailsView
                postId={viewingPostId}
                onClose={handleCloseViewPost} />
        </>
    )
}