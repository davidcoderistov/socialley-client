import { GetPostLikeNotificationsForUserQueryType } from '../../../graphql/types/queries/posts'
import { PostLikeNotification } from '../../../graphql/types/models'
import _uniqWith from 'lodash/uniqWith'


interface AddPostLikeNotificationOptions {
    postLikeNotificationsForUser: GetPostLikeNotificationsForUserQueryType
    postLikeNotification: PostLikeNotification
}

interface AddPostLikeNotificationReturnValue {
    postLikeNotificationsForUser: GetPostLikeNotificationsForUserQueryType
}

export function addPostLikeNotification (options: AddPostLikeNotificationOptions): AddPostLikeNotificationReturnValue {
    const { postLikeNotificationsForUser, postLikeNotification } = options

    const exists = postLikeNotificationsForUser.getPostLikeNotificationsForUser.data.some(notification =>
        notification.post._id === postLikeNotification.post._id && notification.user._id === postLikeNotification.user._id)

    return {
        postLikeNotificationsForUser: {
            ...postLikeNotificationsForUser,
            getPostLikeNotificationsForUser: {
                ...postLikeNotificationsForUser.getPostLikeNotificationsForUser,
                data: _uniqWith([
                    postLikeNotification,
                    ...postLikeNotificationsForUser.getPostLikeNotificationsForUser.data
                ], (first, second) => {
                    return first.post._id === second.post._id && first.user._id === second.user._id
                }),
                total: exists ?
                    postLikeNotificationsForUser.getPostLikeNotificationsForUser.total :
                    postLikeNotificationsForUser.getPostLikeNotificationsForUser.total + 1
            }
        }
    }
}