import { UsersWhoLikedPostQueryData } from '../../../graphql/types'
import { LikingUser } from '../../../types'
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

interface AddLikingUserOptions {
    usersWhoLikedPost: UsersWhoLikedPostQueryData
    likingUser: LikingUser
}

interface AddLikingUserReturnValue {
    usersWhoLikedPost: UsersWhoLikedPostQueryData
    success: boolean
}

export function addLikingUser (options: AddLikingUserOptions): AddLikingUserReturnValue {
    const { usersWhoLikedPost, likingUser } = options

    const usersWhoLikedPostResult = {
        ...usersWhoLikedPost,
        getUsersWhoLikedPost: {
            ...usersWhoLikedPost.getUsersWhoLikedPost,
            data: [likingUser, ...usersWhoLikedPost.getUsersWhoLikedPost.data],
            total: usersWhoLikedPost.getUsersWhoLikedPost.total + 1
        }
    }

    return {
        usersWhoLikedPost: usersWhoLikedPostResult,
        success: true,
    }
}

interface RemoveLikingUserOptions {
    usersWhoLikedPost: UsersWhoLikedPostQueryData
    userId: string
}

interface RemoveLikingUserReturnValue {
    usersWhoLikedPost: UsersWhoLikedPostQueryData
    success: boolean
}

export function removeLikingUser (options: RemoveLikingUserOptions): RemoveLikingUserReturnValue {
    const { usersWhoLikedPost, userId } = options

    const findLikingUserIndex = usersWhoLikedPost.getUsersWhoLikedPost.data.findIndex(likingUser => likingUser._id === userId)
    if (findLikingUserIndex >= 0) {
        const newData = [...usersWhoLikedPost.getUsersWhoLikedPost.data]
        newData.splice(findLikingUserIndex, 1)
        return {
            usersWhoLikedPost: {
                ...usersWhoLikedPost,
                getUsersWhoLikedPost: {
                    ...usersWhoLikedPost.getUsersWhoLikedPost,
                    data: newData,
                    total: usersWhoLikedPost.getUsersWhoLikedPost.total - 1
                }
            },
            success: true
        }
    }

    return {
        usersWhoLikedPost,
        success: false,
    }
}