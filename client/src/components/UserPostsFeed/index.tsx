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
import { GET_POSTS_FOR_USER, GET_POST_DETAILS } from '../../graphql/queries/posts'
import { GetPostsForUserQueryType, GetPostDetailsQueryType } from '../../graphql/types/queries/posts'
import { BoxProps } from '@mui/material/Box'
import PostsFeed from '../PostsFeed'
import PostView from '../PostView/PostView'
import { PostDetails as PostViewDetails } from '../../types'


interface UserPostsFeedProps {
    userId: string
    boxProps?: BoxProps
    dense?: boolean
    shouldSkipQuery?: boolean
}

export default function UserPostsFeed ({ userId, boxProps = {}, dense = false, shouldSkipQuery = false }: UserPostsFeedProps) {

    const [viewingPostId, setViewingPostId] = useState<string | null>(null)

    const postDetails = useQuery<GetPostDetailsQueryType>(GET_POST_DETAILS, {
        variables: { postId: viewingPostId },
        skip: !viewingPostId,
    })

    const [getUserPosts, userPosts] = useLazyQuery<GetPostsForUserQueryType>(GET_POSTS_FOR_USER)

    useEffect(() => {
        if (!shouldSkipQuery && !userPosts.called) {
            getUserPosts({ variables: { userId, offset: 0, limit: 10 } })
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
            variables: { userId, offset: posts.length },
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
            markPostAsFavorite(postId, postViewDetails as PostViewDetails)
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
                isPostsLoading={userPosts.loading}
                hasMorePosts={hasMorePosts}
                onFetchMorePosts={handleFetchMorePosts}
                onClickPost={handleClickPost} />
            { viewingPostId && (
                <PostView
                    postDetails={postViewDetails}
                    isPostDetailsLoading={postDetails.loading}
                    onClickUser={handleCloseViewPost}
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