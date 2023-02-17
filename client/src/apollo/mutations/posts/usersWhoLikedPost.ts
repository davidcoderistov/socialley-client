import { UsersWhoLikedPostQueryData } from '../../../graphql/types'
import { updateLikingUserByUserId } from '../../utils'


interface UpdateFollowingLoadingStatusOptions {
    usersWhoLikedPost: UsersWhoLikedPostQueryData
    userId: string
    isFollowingLoading: boolean
}

interface UpdateFollowingLoadingStatusReturnValue {
    usersWhoLikedPost: UsersWhoLikedPostQueryData
    success: boolean
}

export function updateFollowingLoadingStatus (options: UpdateFollowingLoadingStatusOptions): UpdateFollowingLoadingStatusReturnValue {
    return updateLikingUserByUserId({
        usersWhoLikedPost: options.usersWhoLikedPost,
        userId: options.userId,
        likingUser: { isFollowingLoading: options.isFollowingLoading }
    })
}

interface ToggleFollowingStatusOptions {
    usersWhoLikedPost: UsersWhoLikedPostQueryData
    userId: string
    following: boolean
}

interface ToggleFollowingStatusReturnValue {
    usersWhoLikedPost: UsersWhoLikedPostQueryData
    success: boolean
}

export function updateFollowingStatus (options: ToggleFollowingStatusOptions): ToggleFollowingStatusReturnValue {
    return updateLikingUserByUserId({
        usersWhoLikedPost: options.usersWhoLikedPost,
        userId: options.userId,
        likingUser: {
            following: options.following,
            isFollowingLoading: false
        }
    })
}