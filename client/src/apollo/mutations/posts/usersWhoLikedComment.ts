import { UsersWhoLikedCommentQueryData } from '../../../graphql/types'
import { LikingUser } from '../../../types'
import { updateCommentLikingUserByUserId } from '../../utils'


interface UpdateFollowingLoadingStatusOptions {
    usersWhoLikedComment: UsersWhoLikedCommentQueryData
    userId: string
    isFollowingLoading: boolean
}

interface UpdateFollowingLoadingStatusReturnValue {
    usersWhoLikedComment: UsersWhoLikedCommentQueryData
    success: boolean
}

export function updateFollowingLoadingStatus (options: UpdateFollowingLoadingStatusOptions): UpdateFollowingLoadingStatusReturnValue {
    return updateCommentLikingUserByUserId({
        usersWhoLikedComment: options.usersWhoLikedComment,
        userId: options.userId,
        likingUser: { isFollowingLoading: options.isFollowingLoading }
    })
}

interface UpdateFollowingStatusOptions {
    usersWhoLikedComment: UsersWhoLikedCommentQueryData
    userId: string
    following: boolean
}

interface UpdateFollowingStatusReturnValue {
    usersWhoLikedComment: UsersWhoLikedCommentQueryData
    success: boolean
}

export function updateFollowingStatus (options: UpdateFollowingStatusOptions): UpdateFollowingStatusReturnValue {
    return updateCommentLikingUserByUserId({
        usersWhoLikedComment: options.usersWhoLikedComment,
        userId: options.userId,
        likingUser: {
            following: options.following,
            isFollowingLoading: false
        }
    })
}

interface AddLikingUserOptions {
    usersWhoLikedComment: UsersWhoLikedCommentQueryData
    likingUser: LikingUser
}

interface AddLikingUserReturnValue {
    usersWhoLikedComment: UsersWhoLikedCommentQueryData
    success: boolean
}

export function addLikingUser (options: AddLikingUserOptions): AddLikingUserReturnValue {
    const { usersWhoLikedComment, likingUser } = options

    const usersWhoLikedCommentResult = {
        ...usersWhoLikedComment,
        getUsersWhoLikedComment: {
            ...usersWhoLikedComment.getUsersWhoLikedComment,
            data: [likingUser, ...usersWhoLikedComment.getUsersWhoLikedComment.data],
            total: usersWhoLikedComment.getUsersWhoLikedComment.total + 1
        }
    }

    return {
        usersWhoLikedComment: usersWhoLikedCommentResult,
        success: true,
    }
}

interface RemoveLikingUserOptions {
    usersWhoLikedComment: UsersWhoLikedCommentQueryData
    userId: string
}

interface RemoveLikingUserReturnValue {
    usersWhoLikedComment: UsersWhoLikedCommentQueryData
    success: boolean
}

export function removeLikingUser (options: RemoveLikingUserOptions): RemoveLikingUserReturnValue {
    const { usersWhoLikedComment, userId } = options

    const findLikingUserIndex = usersWhoLikedComment.getUsersWhoLikedComment.data.findIndex(likingUser => likingUser._id === userId)
    if (findLikingUserIndex >= 0) {
        const newData = [...usersWhoLikedComment.getUsersWhoLikedComment.data]
        newData.splice(findLikingUserIndex, 1)
        return {
            usersWhoLikedComment: {
                ...usersWhoLikedComment,
                getUsersWhoLikedComment: {
                    ...usersWhoLikedComment.getUsersWhoLikedComment,
                    data: newData,
                    total: usersWhoLikedComment.getUsersWhoLikedComment.total - 1
                }
            },
            success: true
        }
    }

    return {
        usersWhoLikedComment,
        success: false,
    }
}

export default {
    updateFollowingLoadingStatus,
    updateFollowingStatus,
    addLikingUser,
    removeLikingUser
}