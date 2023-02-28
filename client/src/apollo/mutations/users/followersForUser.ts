import { GetFollowersForUserQueryType } from '../../../graphql/types/queries/users'
import { updateOneFollowerUser } from '../../utils'


interface UpdateFollowingLoadingStatusOptions {
    followerUsers: GetFollowersForUserQueryType
    userId: string
    isFollowingLoading: boolean
}

interface UpdateFollowingLoadingStatusReturnValue {
    followerUsers: GetFollowersForUserQueryType
    success: boolean
}

export function updateFollowingLoadingStatus (options: UpdateFollowingLoadingStatusOptions): UpdateFollowingLoadingStatusReturnValue {
    return updateOneFollowerUser({
        followerUsers: options.followerUsers,
        userId: options.userId,
        mapper (followerUser) {
            return {
                ...followerUser,
                isFollowingLoading: options.isFollowingLoading
            }
        }
    })
}

interface UpdateFollowingStatusOptions {
    followerUsers: GetFollowersForUserQueryType
    userId: string
    following: boolean
}

interface UpdateFollowingStatusReturnValue {
    followerUsers: GetFollowersForUserQueryType
    success: boolean
}

export function updateFollowingStatus (options: UpdateFollowingStatusOptions): UpdateFollowingStatusReturnValue {
    return updateOneFollowerUser({
        followerUsers: options.followerUsers,
        userId: options.userId,
        mapper (followerUser) {
            return {
                ...followerUser,
                followableUser: {
                    ...followerUser.followableUser,
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