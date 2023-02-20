import { CommentsForPostQueryData } from '../../../graphql/types'
import { Comment } from '../../../types'


interface UpdateCommentLikedLoadingStatusOptions {
    commentsForPost: CommentsForPostQueryData
    commentId: string
    isLikedLoading: boolean
}

interface UpdateCommentLikedLoadingStatusReturnValue {
    commentsForPost: CommentsForPostQueryData
    success: boolean
}

export function updateCommentLikedLoadingStatus (options: UpdateCommentLikedLoadingStatusOptions): UpdateCommentLikedLoadingStatusReturnValue {
    const { commentsForPost, commentId, isLikedLoading } = options

    let success = false
    const commentsForPostResult = {
        ...commentsForPost,
        getCommentsForPost: {
            ...commentsForPost.getCommentsForPost,
            data: commentsForPost.getCommentsForPost.data.map(comment => {
                if (comment._id === commentId) {
                    success = true
                    return {
                        ...comment,
                        isLikedLoading,
                    }
                }
                return comment
            })
        }
    }

    return {
        commentsForPost: commentsForPostResult,
        success,
    }
}

interface UpdateCommentLikedStatusOptions {
    commentsForPost: CommentsForPostQueryData
    commentId: string
    liked: boolean
}

interface UpdateCommentLikedStatusReturnValue {
    commentsForPost: CommentsForPostQueryData
    success: boolean
}

export function updateCommentLikedStatus (options: UpdateCommentLikedStatusOptions): UpdateCommentLikedStatusReturnValue {
    const { commentsForPost, commentId, liked } = options

    let success = false
    const commentsForPostResult = {
        ...commentsForPost,
        getCommentsForPost: {
            ...commentsForPost.getCommentsForPost,
            data: commentsForPost.getCommentsForPost.data.map(comment => {
                if (comment._id === commentId) {
                    success = true
                    return {
                        ...comment,
                        liked,
                        isLikedLoading: false,
                        likesCount: liked ? comment.likesCount + 1 : comment.likesCount - 1
                    }
                }
                return comment
            })
        }
    }

    return {
        commentsForPost: commentsForPostResult,
        success,
    }
}

interface AddCommentForPostOptions {
    commentsForPost: CommentsForPostQueryData
    comment: Comment
}

interface AddCommentForPostReturnValue {
    commentsForPost: CommentsForPostQueryData
    success: boolean
}

export function addCommentForPost (options: AddCommentForPostOptions): AddCommentForPostReturnValue {
    const { commentsForPost, comment } = options

    return {
        commentsForPost: {
            ...commentsForPost,
            getCommentsForPost: {
                ...commentsForPost.getCommentsForPost,
                data: [...commentsForPost.getCommentsForPost.data, comment],
                total: commentsForPost.getCommentsForPost.total + 1
            }
        },
        success: true,
    }
}