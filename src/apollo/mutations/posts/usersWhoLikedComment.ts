import { GetUsersWhoLikedCommentQueryType } from '../../../graphql/types/queries/posts'
import { UserWhoLikedComment } from '../../../graphql/types/models'
import { updateOneUserWhoLikedComment } from '../../utils'


interface UpdateFollowingLoadingStatusOptions {
    usersWhoLikedComment: GetUsersWhoLikedCommentQueryType
    userId: string
    isFollowingLoading: boolean
}

interface UpdateFollowingLoadingStatusReturnValue {
    usersWhoLikedComment: GetUsersWhoLikedCommentQueryType
    success: boolean
}

export function updateFollowingLoadingStatus (options: UpdateFollowingLoadingStatusOptions): UpdateFollowingLoadingStatusReturnValue {
    return updateOneUserWhoLikedComment({
        usersWhoLikedComment: options.usersWhoLikedComment,
        userId: options.userId,
        mapper (userWhoLikedComment) {
            return {
                ...userWhoLikedComment,
                isFollowingLoading: options.isFollowingLoading
            }
        }
    })
}

interface UpdateFollowingStatusOptions {
    usersWhoLikedComment: GetUsersWhoLikedCommentQueryType
    userId: string
    following: boolean
}

interface UpdateFollowingStatusReturnValue {
    usersWhoLikedComment: GetUsersWhoLikedCommentQueryType
    success: boolean
}

export function updateFollowingStatus (options: UpdateFollowingStatusOptions): UpdateFollowingStatusReturnValue {
    return updateOneUserWhoLikedComment({
        usersWhoLikedComment: options.usersWhoLikedComment,
        userId: options.userId,
        mapper (userWhoLikedComment) {
            return {
                ...userWhoLikedComment,
                followableUser: {
                    ...userWhoLikedComment.followableUser,
                    following: options.following
                },
                isFollowingLoading: false
            }
        }
    })
}

interface AddUserWhoLikedCommentOptions {
    usersWhoLikedComment: GetUsersWhoLikedCommentQueryType
    userWhoLikedComment: UserWhoLikedComment
}

interface AddUserWhoLikedCommentReturnValue {
    usersWhoLikedComment: GetUsersWhoLikedCommentQueryType
    success: boolean
}

export function addUserWhoLikedComment (options: AddUserWhoLikedCommentOptions): AddUserWhoLikedCommentReturnValue {
    const { usersWhoLikedComment, userWhoLikedComment } = options

    const usersWhoLikedCommentResult = {
        ...usersWhoLikedComment,
        getUsersWhoLikedComment: {
            ...usersWhoLikedComment.getUsersWhoLikedComment,
            data: [userWhoLikedComment, ...usersWhoLikedComment.getUsersWhoLikedComment.data],
            total: usersWhoLikedComment.getUsersWhoLikedComment.total + 1
        }
    }

    return {
        usersWhoLikedComment: usersWhoLikedCommentResult,
        success: true,
    }
}

interface RemoveUserWhoLikedCommentOptions {
    usersWhoLikedComment: GetUsersWhoLikedCommentQueryType
    userId: string
}

interface RemoveUserWhoLikedCommentReturnValue {
    usersWhoLikedComment: GetUsersWhoLikedCommentQueryType
    success: boolean
}

export function removeUserWhoLikedComment (options: RemoveUserWhoLikedCommentOptions): RemoveUserWhoLikedCommentReturnValue {
    const { usersWhoLikedComment, userId } = options

    const findUserWhoLikedCommentIndex = usersWhoLikedComment.getUsersWhoLikedComment.data
        .findIndex(userWhoLikedComment => userWhoLikedComment.followableUser.user._id === userId)
    if (findUserWhoLikedCommentIndex >= 0) {
        const newData = [...usersWhoLikedComment.getUsersWhoLikedComment.data]
        newData.splice(findUserWhoLikedCommentIndex, 1)
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
    addUserWhoLikedComment,
    removeUserWhoLikedComment,
}