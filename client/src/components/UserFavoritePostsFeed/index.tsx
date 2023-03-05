import React, { useState, useEffect, useMemo } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import {
    useComments,
    useCreateComment,
    useLikeComment,
    useUnlikeComment,
    useLikePost,
    useUnlikePost,
    useMarkPostAsFavorite,
    useUnmarkPostAsFavorite,
    useUpdateFollowedUserPostCommentsCount,
} from '../../hooks/graphql/posts'
import { GET_FAVORITE_POSTS_FOR_USER, GET_POST_DETAILS } from '../../graphql/queries/posts'
import { GetFavoritePostsForUserQueryType, GetPostDetailsQueryType } from '../../graphql/types/queries/posts'
import { BoxProps } from '@mui/material/Box'
import PostsFeed from '../PostsFeed'
import PostView from '../PostView/PostView'
import { PostDetails as PostViewDetails } from '../../types'


interface UserPostsFeedProps {
    boxProps?: BoxProps
    dense?: boolean
    shouldSkipQuery?: boolean
}

export default function UserFavoritePostsFeed ({ boxProps = {}, dense = false, shouldSkipQuery = false }: UserPostsFeedProps) {

    const [viewingPostId, setViewingPostId] = useState<string | null>(null)

    const postDetails = useQuery<GetPostDetailsQueryType>(GET_POST_DETAILS, {
        variables: { postId: viewingPostId },
        skip: !viewingPostId,
    })

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
                    getPostsForUser: {
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

    const postViewDetails: PostViewDetails | null = useMemo(() => {
        if (postDetails.data) {
            return {
                ...postDetails.data.getPostDetails,
                ...postDetails.data.getPostDetails.post,
                user: {
                    ...postDetails.data.getPostDetails.user,
                    following: false,
                    isFollowingLoading: false,
                },
            }
        }
        return null
    }, [postDetails.data])

    const handleClickPost = (postId: string) => {
        setViewingPostId(postId)
    }

    const handleCloseViewPost = () => {
        setViewingPostId(null)
    }

    const likePost = useLikePost()
    const unlikePost = useUnlikePost()

    const handleLikePost = (postId: string, liked: boolean) => {
        if (liked) {
            likePost(postId, postViewDetails as PostViewDetails)
        } else {
            unlikePost(postId, postViewDetails as PostViewDetails)
        }
    }

    const markPostAsFavorite = useMarkPostAsFavorite()
    const unmarkPostAsFavorite = useUnmarkPostAsFavorite()

    const handleBookmarkPost = (postId: string, favorite: boolean) => {
        if (favorite) {
            markPostAsFavorite(postId)
        } else {
            unmarkPostAsFavorite(postId)
        }
    }

    const { commentsForPost, fetchMoreComments, hasMoreComments } = useComments({ postId: viewingPostId })

    const likeComment = useLikeComment()
    const unlikeComment = useUnlikeComment()

    const handleLikeComment = (commentId: string, postId: string, liked: boolean) => {
        if (liked) {
            likeComment(commentId, postId)
        } else {
            unlikeComment(commentId, postId)
        }
    }

    const { createComment, createCommentData } = useCreateComment({ postId: viewingPostId })

    const updateFollowedUserPostCommentsCount = useUpdateFollowedUserPostCommentsCount()

    const handlePostComment = (comment: string) => {
        createComment(
            comment,
            () => updateFollowedUserPostCommentsCount(viewingPostId as string)
        )
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
            { viewingPostId && (
                <PostView
                    postDetails={postViewDetails}
                    isPostDetailsLoading={postDetails.loading}
                    onClickUser={() => {}}
                    onFollowUser={() => {}}
                    onLikePost={handleLikePost}
                    onBookmarkPost={handleBookmarkPost}
                    comments={commentsForPost.data?.getCommentsForPost.data ?? []}
                    hasMoreComments={hasMoreComments}
                    commentsLoading={commentsForPost.loading}
                    onFetchMoreComments={fetchMoreComments}
                    onLikeComment={handleLikeComment}
                    isCommentPosting={createCommentData.loading}
                    onPostComment={handlePostComment}
                    onClose={handleCloseViewPost} />
            )}
        </>
    )
}