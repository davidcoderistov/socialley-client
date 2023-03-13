import { GetFollowNotificationsForUserQueryType } from '../../../graphql/types/queries/users'
import { updateOneFollowNotification } from '../../utils'


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

export default {
    updateFollowingLoadingStatus,
    updateFollowingStatus,
}