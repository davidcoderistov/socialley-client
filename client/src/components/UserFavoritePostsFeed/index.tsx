import React, { useState, useEffect, useMemo } from 'react'
import { useLazyQuery } from '@apollo/client'
import { GET_FAVORITE_POSTS_FOR_USER } from '../../graphql/queries/posts'
import { GetFavoritePostsForUserQueryType } from '../../graphql/types/queries/posts'
import { BoxProps } from '@mui/material/Box'
import PostsFeed from '../PostsFeed'
import PostDetailsView from '../PostDetailsView'


interface UserPostsFeedProps {
    boxProps?: BoxProps
    dense?: boolean
    shouldSkipQuery?: boolean
}

export default function UserFavoritePostsFeed ({ boxProps = {}, dense = false, shouldSkipQuery = false }: UserPostsFeedProps) {

    const [viewingPostId, setViewingPostId] = useState<string | null>(null)

    const [getUserFavoritePosts, userFavoritePosts] = useLazyQuery<GetFavoritePostsForUserQueryType>(GET_FAVORITE_POSTS_FOR_USER)

    useEffect(() => {
        if (!shouldSkipQuery && !userFavoritePosts.called) {
            getUserFavoritePosts({ variables: { offset: 0, limit: 10 } })
        }
    }, [shouldSkipQuery])

    const posts = useMemo(() => {
        if (userFavoritePosts.data) {
            return userFavoritePosts.data.getFavoritePostsForUser.data
        }
        return []
    }, [userFavoritePosts.data])

    const hasMorePosts = useMemo(() => {
        if (userFavoritePosts.loading || userFavoritePosts.error || !userFavoritePosts.data) {
            return false
        }
        return posts.length < userFavoritePosts.data.getFavoritePostsForUser.total
    }, [posts, userFavoritePosts.loading, userFavoritePosts.error])

    const handleFetchMorePosts = () => {
        userFavoritePosts.fetchMore({
            variables: { offset: posts.length },
            updateQuery (existing, { fetchMoreResult } : { fetchMoreResult: GetFavoritePostsForUserQueryType }) {
                return {
                    ...existing,
                    getFavoritePostsForUser: {
                        ...existing.getFavoritePostsForUser,
                        data: [
                            ...existing.getFavoritePostsForUser.data,
                            ...fetchMoreResult.getFavoritePostsForUser.data,
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
                isPostsLoading={userFavoritePosts.loading}
                hasMorePosts={hasMorePosts}
                onFetchMorePosts={handleFetchMorePosts}
                onClickPost={handleClickPost} />
            <PostDetailsView
                postId={viewingPostId}
                onClose={handleCloseViewPost} />
        </>
    )
}