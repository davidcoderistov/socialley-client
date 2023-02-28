import { GetFollowingForUserQueryType } from '../../../graphql/types/queries/users'
import { updateOneFollowingUser } from '../../utils'


interface UpdateFollowingLoadingStatusOptions {
    followingUsers: GetFollowingForUserQueryType
    userId: string
    isFollowingLoading: boolean
}

interface UpdateFollowingLoadingStatusReturnValue {
    followingUsers: GetFollowingForUserQueryType
    success: boolean
}

export function updateFollowingLoadingStatus (options: UpdateFollowingLoadingStatusOptions): UpdateFollowingLoadingStatusReturnValue {
    return updateOneFollowingUser({
        followingUsers: options.followingUsers,
        userId: options.userId,
        mapper (followingUser) {
            return {
                ...followingUser,
                isFollowingLoading: options.isFollowingLoading
            }
        }
    })
}

interface UpdateFollowingStatusOptions {
    followingUsers: GetFollowingForUserQueryType
    userId: string
    following: boolean
}

interface UpdateFollowingStatusReturnValue {
    followingUsers: GetFollowingForUserQueryType
    success: boolean
}

export function updateFollowingStatus (options: UpdateFollowingStatusOptions): UpdateFollowingStatusReturnValue {
    return updateOneFollowingUser({
        followingUsers: options.followingUsers,
        userId: options.userId,
        mapper (followingUser) {
            return {
                ...followingUser,
                followableUser: {
                    ...followingUser.followableUser,
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