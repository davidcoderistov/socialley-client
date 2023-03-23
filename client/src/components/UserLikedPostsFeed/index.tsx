import React, { useState, useEffect, useMemo } from 'react'
import { useFetchMore } from '../../hooks/misc'
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

    const [offset, fetchMoreUserLikedPosts] = useFetchMore<GetLikedPostsForUserQueryType>({
        queryResult: userLikedPosts,
        updateQuery (existing, incoming) {
            return {
                ...existing,
                getLikedPostsForUser: {
                    ...existing.getLikedPostsForUser,
                    data: [
                        ...existing.getLikedPostsForUser.data,
                        ...incoming.getLikedPostsForUser.data,
                    ]
                }
            }
        }
    })

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
        return offset < userLikedPosts.data.getLikedPostsForUser.total
    }, [offset, userLikedPosts.loading, userLikedPosts.error])

    const handleFetchMorePosts = () => {
        fetchMoreUserLikedPosts()
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