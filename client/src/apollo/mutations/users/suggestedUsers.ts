import { SuggestedUsersQueryData } from '../../../graphql/types'
import { updateSuggestedUserByUserId } from '../../utils'


interface UpdateFollowingLoadingStatusOptions {
    suggestedUsers: SuggestedUsersQueryData
    userId: string
    isFollowingLoading: boolean
}

interface UpdateFollowingLoadingStatusReturnValue {
    suggestedUsers: SuggestedUsersQueryData
    success: boolean
}

export function updateFollowingLoadingStatus (options: UpdateFollowingLoadingStatusOptions): UpdateFollowingLoadingStatusReturnValue {
    return updateSuggestedUserByUserId({
        suggestedUsers: options.suggestedUsers,
        userId: options.userId,
        suggestedUser: { isFollowingLoading: options.isFollowingLoading }
    })
}

interface UpdateFollowingStatusOptions {
    suggestedUsers: SuggestedUsersQueryData
    userId: string
    following: boolean
}

interface UpdateFollowingStatusReturnValue {
    suggestedUsers: SuggestedUsersQueryData
    success: boolean
}

export function updateFollowingStatus (options: UpdateFollowingStatusOptions): UpdateFollowingStatusReturnValue {
    return updateSuggestedUserByUserId({
        suggestedUsers: options.suggestedUsers,
        userId: options.userId,
        suggestedUser: {
            following: options.following,
            isFollowingLoading: false,
        }
    })
}

export default {
    updateFollowingLoadingStatus,
    updateFollowingStatus,
}