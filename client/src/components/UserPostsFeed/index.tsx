import React, { useState, useEffect, useMemo } from 'react'
import { useFetchMore } from '../../hooks/misc'
import { useLazyQuery } from '@apollo/client'
import { GET_POSTS_FOR_USER } from '../../graphql/queries/posts'
import { GetPostsForUserQueryType } from '../../graphql/types/queries/posts'
import { BoxProps } from '@mui/material/Box'
import PostsFeed from '../PostsFeed'
import PostDetailsView from '../PostDetailsView'


interface UserPostsFeedProps {
    userId: string
    postId?: string | null
    boxProps?: BoxProps
    dense?: boolean
    shouldSkipQuery?: boolean
}

export default function UserPostsFeed ({ userId, postId = null, boxProps = {}, dense = false, shouldSkipQuery = false }: UserPostsFeedProps) {

    const [viewingPostId, setViewingPostId] = useState<string | null>(null)

    const [getUserPosts, userPosts] = useLazyQuery<GetPostsForUserQueryType>(GET_POSTS_FOR_USER)

    const [offset, fetchMoreUserPosts] = useFetchMore<GetPostsForUserQueryType>({
        queryResult: userPosts,
        updateQuery (existing, incoming) {
            return {
                ...existing,
                getPostsForUser: {
                    ...existing.getPostsForUser,
                    data: [
                        ...existing.getPostsForUser.data,
                        ...incoming.getPostsForUser.data,
                    ]
                }
            }
        }
    }, 6)

    useEffect(() => {
        if (!shouldSkipQuery) {
            getUserPosts({ variables: { userId, offset: 0, limit: 6 } })
        }
    }, [shouldSkipQuery, userId])

    useEffect(() => {
        if (postId) {
            setViewingPostId(postId)
        }
    }, [postId])

    const posts = useMemo(() => {
        if (userPosts.data) {
            return userPosts.data.getPostsForUser.data
        }
        return []
    }, [userPosts.data])

    const hasMorePosts = useMemo(() => {
        if (userPosts.loading || userPosts.error || !userPosts.data) {
            return false
        }
        return offset < userPosts.data.getPostsForUser.total
    }, [offset, userPosts.loading, userPosts.error])

    const handleFetchMorePosts = () => {
        fetchMoreUserPosts()
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
                isPostsLoading={userPosts.loading}
                hasMorePosts={hasMorePosts}
                onFetchMorePosts={handleFetchMorePosts}
                onClickPost={handleClickPost} />
            <PostDetailsView
                postId={viewingPostId}
                onClose={handleCloseViewPost} />
        </>
    )
}