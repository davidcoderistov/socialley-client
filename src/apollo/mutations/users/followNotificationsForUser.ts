import { GetFollowNotificationsForUserQueryType } from '../../../graphql/types/queries/users'
import { FollowNotification } from '../../../graphql/types/models'
import { updateOneFollowNotification } from '../../utils'
import _uniqBy from 'lodash/uniqBy'


interface UpdateFollowingLoadingStatusOptions {
    followNotificationsForUser: GetFollowNotificationsForUserQueryType
    userId: string
    isFollowingLoading: boolean
}

interface UpdateFollowingLoadingStatusReturnValue {
    followNotificationsForUser: GetFollowNotificationsForUserQueryType
    success: boolean
}

export function updateFollowingLoadingStatus (options: UpdateFollowingLoadingStatusOptions): UpdateFollowingLoadingStatusReturnValue {
    return updateOneFollowNotification({
        followNotificationsForUser: options.followNotificationsForUser,
        userId: options.userId,
        mapper (followNotification) {
            return {
                ...followNotification,
                isFollowingLoading: options.isFollowingLoading
            }
        }
    })
}

interface UpdateFollowingStatusOptions {
    followNotificationsForUser: GetFollowNotificationsForUserQueryType
    userId: string
    following: boolean
}

interface UpdateFollowingStatusReturnValue {
    followNotificationsForUser: GetFollowNotificationsForUserQueryType
    success: boolean
}

export function updateFollowingStatus (options: UpdateFollowingStatusOptions): UpdateFollowingStatusReturnValue {
    return updateOneFollowNotification({
        followNotificationsForUser: options.followNotificationsForUser,
        userId: options.userId,
        mapper (followNotification) {
            return {
                ...followNotification,
                followableUser: {
                    ...followNotification.followableUser,
                    following: options.following
                },
                isFollowingLoading: false,
            }
        }
    })
}

interface AddFollowNotificationOptions {
    followNotificationsForUser: GetFollowNotificationsForUserQueryType
    followNotification: FollowNotification
}

interface AddFollowNotificationReturnValue {
    followNotificationsForUser: GetFollowNotificationsForUserQueryType
}

export function addFollowNotification (options: AddFollowNotificationOptions): AddFollowNotificationReturnValue {
    const { followNotificationsForUser, followNotification } = options

    const exists = followNotificationsForUser.getFollowNotificationsForUser.data.some(notification =>
        notification.followableUser.user._id === followNotification.followableUser.user._id)

    return {
        followNotificationsForUser: {
            ...followNotificationsForUser,
            getFollowNotificationsForUser: {
                ...followNotificationsForUser.getFollowNotificationsForUser,
                data: _uniqBy([
                    followNotification,
                    ...followNotificationsForUser.getFollowNotificationsForUser.data
                ], followNotification => followNotification.followableUser.user._id),
                total: exists ?
                    followNotificationsForUser.getFollowNotificationsForUser.total :
                    followNotificationsForUser.getFollowNotificationsForUser.total + 1
            }
        }
    }
}

export default {
    updateFollowingLoadingStatus,
    updateFollowingStatus,
    addFollowNotification,
}