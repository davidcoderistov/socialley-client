import { GetCommentsForPostQueryType } from '../../../graphql/types/queries/posts'
import { Comment } from '../../../graphql/types/models'
import { updateOneCommentForPost } from '../../utils'


interface UpdateCommentLikedLoadingStatusOptions {
    commentsForPost: GetCommentsForPostQueryType
    commentId: string
    isLikedLoading: boolean
}

interface UpdateCommentLikedLoadingStatusReturnValue {
    commentsForPost: GetCommentsForPostQueryType
    success: boolean
}

export function updateCommentLikedLoadingStatus (options: UpdateCommentLikedLoadingStatusOptions): UpdateCommentLikedLoadingStatusReturnValue {
    return updateOneCommentForPost({
        commentsForPost: options.commentsForPost,
        commentId: options.commentId,
        mapper (commentForPost) {
            return {
                ...commentForPost,
                isLikedLoading: options.isLikedLoading,
            }
        }
    })
}

interface UpdateCommentLikedStatusOptions {
    commentsForPost: GetCommentsForPostQueryType
    commentId: string
    liked: boolean
}

interface UpdateCommentLikedStatusReturnValue {
    commentsForPost: GetCommentsForPostQueryType
    success: boolean
}

export function updateCommentLikedStatus (options: UpdateCommentLikedStatusOptions): UpdateCommentLikedStatusReturnValue {
    return updateOneCommentForPost({
        commentsForPost: options.commentsForPost,
        commentId: options.commentId,
        mapper (commentForPost) {
            return {
                ...commentForPost,
                liked: options.liked,
                isLikedLoading: false,
                likesCount: options.liked ? commentForPost.likesCount + 1 : commentForPost.likesCount - 1
            }
        }
    })
}

interface AddCommentForPostOptions {
    commentsForPost: GetCommentsForPostQueryType
    comment: Comment
}

interface AddCommentForPostReturnValue {
    commentsForPost: GetCommentsForPostQueryType
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