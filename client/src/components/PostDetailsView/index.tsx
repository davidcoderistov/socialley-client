import React, { useMemo } from 'react'
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
import { GET_POST_DETAILS } from '../../graphql/queries/posts'
import { GetPostDetailsQueryType } from '../../graphql/types/queries/posts'
import PostView from '../PostView/PostView'
import { PostDetails as PostViewDetails } from '../../types'


interface PostDetailsViewProps {
    postId: string | null
    onClose: () => void
}

export default function PostDetailsView ({ postId, onClose }: PostDetailsViewProps) {

    const postDetails = useQuery<GetPostDetailsQueryType>(GET_POST_DETAILS, {
        variables: { postId },
        skip: !postId,
    })

    const postViewDetails: PostViewDetails | null = useMemo(() => {
        if (postDetails.data) {
            return {
                ...postDetails.data.getPostDetails,
                ...postDetails.data.getPostDetails.post,
                user: {
                    ...postDetails.data.getPostDetails.followableUser.user,
                    following: postDetails.data.getPostDetails.followableUser.following,
                    isFollowingLoading: postDetails.data.getPostDetails.isFollowingLoading,
                },
            }
        }
        return null
    }, [postDetails.data])

    const handleCloseViewPost = () => {
        onClose()
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

    const { commentsForPost, fetchMoreComments, hasMoreComments } = useComments({ postId })

    const likeComment = useLikeComment()
    const unlikeComment = useUnlikeComment()

    const handleLikeComment = (commentId: string, postId: string, liked: boolean) => {
        if (liked) {
            likeComment(commentId, postId)
        } else {
            unlikeComment(commentId, postId)
        }
    }

    const { createComment, createCommentData } = useCreateComment({ postId })

    const updateFollowedUserPostCommentsCount = useUpdateFollowedUserPostCommentsCount()

    const handlePostComment = (comment: string) => {
        createComment(
            comment,
            () => updateFollowedUserPostCommentsCount(postId as string)
        )
    }

    return postId ? (
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
    ) : null
}