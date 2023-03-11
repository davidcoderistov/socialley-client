import React, { useState, useMemo } from 'react'
import { useQuery } from '@apollo/client'
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
import { GET_SUGGESTED_POSTS, GET_POST_DETAILS } from '../../graphql/queries/posts'
import { GetSuggestedPostsQueryType, GetPostDetailsQueryType } from '../../graphql/types/queries/posts'
import { BoxProps } from '@mui/material/Box'
import PostsFeed from '../PostsFeed'
import PostView from '../PostView/PostView'
import { PostDetails as PostViewDetails } from '../../types'


export default function SuggestedPostsFeed ({ boxProps = {} }: { boxProps?: BoxProps }) {

    const [viewingPostId, setViewingPostId] = useState<string | null>(null)

    const postDetails = useQuery<GetPostDetailsQueryType>(GET_POST_DETAILS, {
        variables: { postId: viewingPostId },
        skip: !viewingPostId,
    })

    const suggestedPosts = useQuery<GetSuggestedPostsQueryType>(GET_SUGGESTED_POSTS, {
        variables: {
            offset: 0,
            limit: 12,
        }
    })

    const posts = useMemo(() => {
        if (suggestedPosts.data) {
            return suggestedPosts.data.getSuggestedPosts.data
        }
        return []
    }, [suggestedPosts.data])

    const hasMorePosts = useMemo(() => {
        if (suggestedPosts.loading || suggestedPosts.error || !suggestedPosts.data) {
            return false
        }
        return posts.length < suggestedPosts.data.getSuggestedPosts.total
    }, [posts, suggestedPosts.loading, suggestedPosts.error])

    const handleFetchMorePosts = () => {
        suggestedPosts.fetchMore({
            variables: { offset: posts.length },
            updateQuery (existing, { fetchMoreResult } : { fetchMoreResult: GetSuggestedPostsQueryType }) {
                return {
                    ...existing,
                    getSuggestedPosts: {
                        ...existing.getSuggestedPosts,
                        data: [
                            ...existing.getSuggestedPosts.data,
                            ...fetchMoreResult.getSuggestedPosts.data,
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
                posts={posts}
                isPostsLoading={suggestedPosts.loading}
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