import { GetSuggestedUsersQueryType } from '../../../graphql/types/queries/users'
import { updateOneSuggestedUser } from '../../utils'


interface UpdateFollowingLoadingStatusOptions {
    suggestedUsers: GetSuggestedUsersQueryType
    userId: string
    isFollowingLoading: boolean
}

interface UpdateFollowingLoadingStatusReturnValue {
    suggestedUsers: GetSuggestedUsersQueryType
    success: boolean
}

export function updateFollowingLoadingStatus (options: UpdateFollowingLoadingStatusOptions): UpdateFollowingLoadingStatusReturnValue {
    return updateOneSuggestedUser({
        suggestedUsers: options.suggestedUsers,
        userId: options.userId,
        mapper (suggestedUser) {
            return {
                ...suggestedUser,
                isFollowingLoading: options.isFollowingLoading
            }
        }
    })
}

interface UpdateFollowingStatusOptions {
    suggestedUsers: GetSuggestedUsersQueryType
    userId: string
    following: boolean
}

interface UpdateFollowingStatusReturnValue {
    suggestedUsers: GetSuggestedUsersQueryType
    success: boolean
}

export function updateFollowingStatus (options: UpdateFollowingStatusOptions): UpdateFollowingStatusReturnValue {
    return updateOneSuggestedUser({
        suggestedUsers: options.suggestedUsers,
        userId: options.userId,
        mapper (suggestedUser) {
            return {
                ...suggestedUser,
                followableUser: {
                    ...suggestedUser.followableUser,
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