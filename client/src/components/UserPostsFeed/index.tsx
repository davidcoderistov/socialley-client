import React, { useEffect, useMemo } from 'react'
import { useLazyQuery } from '@apollo/client'
import { GET_POSTS_FOR_USER } from '../../graphql/queries/posts'
import { GetPostsForUserQueryType } from '../../graphql/types/queries/posts'
import { BoxProps } from '@mui/material/Box'
import PostsFeed from '../PostsFeed'


interface UserPostsFeedProps {
    boxProps?: BoxProps
    dense?: boolean
    shouldSkipQuery?: boolean
}

export default function UserPostsFeed ({ boxProps = {}, dense = false, shouldSkipQuery = false }: UserPostsFeedProps) {

    const [getUserPosts, userPosts] = useLazyQuery<GetPostsForUserQueryType>(GET_POSTS_FOR_USER)

    useEffect(() => {
        if (!shouldSkipQuery && !userPosts.called) {
            getUserPosts({ variables: { offset: 0, limit: 10 } })
        }
    }, [shouldSkipQuery])

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
        return posts.length < userPosts.data.getPostsForUser.total
    }, [posts, userPosts.loading, userPosts.error])

    const handleFetchMorePosts = () => {
        userPosts.fetchMore({
            variables: { offset: posts.length },
            updateQuery (existing, { fetchMoreResult } : { fetchMoreResult: GetPostsForUserQueryType }) {
                return {
                    ...existing,
                    getPostsForUser: {
                        ...existing.getPostsForUser,
                        data: [
                            ...existing.getPostsForUser.data,
                            ...fetchMoreResult.getPostsForUser.data,
                        ]
                    }
                }
            }
        })
    }

    const handleClickPost = (postId: string) => {

    }

    return (
        <PostsFeed
            boxProps={boxProps}
            dense={dense}
            posts={posts}
            isPostsLoading={userPosts.loading}
            hasMorePosts={hasMorePosts}
            onFetchMorePosts={handleFetchMorePosts}
            onClickPost={handleClickPost} />
    )
}