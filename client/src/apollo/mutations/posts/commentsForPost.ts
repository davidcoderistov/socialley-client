import { CommentsForPostQueryData } from '../../../graphql/types'


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