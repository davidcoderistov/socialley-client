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
import { GET_LIKED_POSTS_FOR_USER, GET_POST_DETAILS } from '../../graphql/queries/posts'
import { GetLikedPostsForUserQueryType, GetPostDetailsQueryType } from '../../graphql/types/queries/posts'
import { BoxProps } from '@mui/material/Box'
import PostsFeed from '../PostsFeed'
import PostView from '../PostView/PostView'
import { PostDetails as PostViewDetails } from '../../types'


interface UserPostsFeedProps {
    boxProps?: BoxProps
    dense?: boolean
    shouldSkipQuery?: boolean
}

export default function UserLikedPostsFeed ({ boxProps = {}, dense = false, shouldSkipQuery = false }: UserPostsFeedProps) {

    const [viewingPostId, setViewingPostId] = useState<string | null>(null)

    const postDetails = useQuery<GetPostDetailsQueryType>(GET_POST_DETAILS, {
        variables: { postId: viewingPostId },
        skip: !viewingPostId,
    })

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
                    getPostsForUser: {
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
            likePost(postId)
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
                isPostsLoading={userLikedPosts.loading}
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