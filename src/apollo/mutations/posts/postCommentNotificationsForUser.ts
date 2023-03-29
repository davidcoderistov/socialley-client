import { GetPostCommentNotificationsForUserQueryType } from '../../../graphql/types/queries/posts'
import { PostCommentNotification } from '../../../graphql/types/models'


interface AddPostCommentNotificationOptions {
    postCommentNotificationsForUser: GetPostCommentNotificationsForUserQueryType
    postCommentNotification: PostCommentNotification
}

interface AddPostCommentNotificationReturnValue {
    postCommentNotificationsForUser: GetPostCommentNotificationsForUserQueryType
}

export function addPostCommentNotification (options: AddPostCommentNotificationOptions): AddPostCommentNotificationReturnValue {
    const { postCommentNotificationsForUser, postCommentNotification } = options

    return {
        postCommentNotificationsForUser: {
            ...postCommentNotificationsForUser,
            getPostCommentNotificationsForUser: {
                ...postCommentNotificationsForUser.getPostCommentNotificationsForUser,
                data: [postCommentNotification, ...postCommentNotificationsForUser.getPostCommentNotificationsForUser.data],
                total: postCommentNotificationsForUser.getPostCommentNotificationsForUser.total + 1
            }
        }
    }
}