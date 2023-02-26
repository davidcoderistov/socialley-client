import { GetUsersWhoLikedPostQueryType, UserWhoLikedPost } from '../../../graphql/queries/posts'
import { updateOneUserWhoLikedPost } from '../../utils'


interface UpdateFollowingLoadingStatusOptions {
    usersWhoLikedPost: GetUsersWhoLikedPostQueryType
    userId: string
    isFollowingLoading: boolean
}

interface UpdateFollowingLoadingStatusReturnValue {
    usersWhoLikedPost: GetUsersWhoLikedPostQueryType
    success: boolean
}

export function updateFollowingLoadingStatus (options: UpdateFollowingLoadingStatusOptions): UpdateFollowingLoadingStatusReturnValue {
    return updateOneUserWhoLikedPost({
        usersWhoLikedPost: options.usersWhoLikedPost,
        userId: options.userId,
        mapper (userWhoLikedPost) {
            return {
                ...userWhoLikedPost,
                isFollowingLoading: options.isFollowingLoading,
            }
        }
    })
}

interface UpdateFollowingStatusOptions {
    usersWhoLikedPost: GetUsersWhoLikedPostQueryType
    userId: string
    following: boolean
}

interface UpdateFollowingStatusReturnValue {
    usersWhoLikedPost: GetUsersWhoLikedPostQueryType
    success: boolean
}

export function updateFollowingStatus (options: UpdateFollowingStatusOptions): UpdateFollowingStatusReturnValue {
    return updateOneUserWhoLikedPost({
        usersWhoLikedPost: options.usersWhoLikedPost,
        userId: options.userId,
        mapper (userWhoLikedPost) {
            return {
                ...userWhoLikedPost,
                followableUser: {
                    ...userWhoLikedPost.followableUser,
                    following: options.following
                },
                isFollowingLoading: false,
            }
        }
    })
}

interface AddUserWhoLikedPostOptions {
    usersWhoLikedPost: GetUsersWhoLikedPostQueryType
    userWhoLikedPost: UserWhoLikedPost
}

interface AddUserWhoLikedPostReturnValue {
    usersWhoLikedPost: GetUsersWhoLikedPostQueryType
    success: boolean
}

export function addUserWhoLikedPost (options: AddUserWhoLikedPostOptions): AddUserWhoLikedPostReturnValue {
    const { usersWhoLikedPost, userWhoLikedPost } = options

    const usersWhoLikedPostResult = {
        ...usersWhoLikedPost,
        getUsersWhoLikedPost: {
            ...usersWhoLikedPost.getUsersWhoLikedPost,
            data: [userWhoLikedPost, ...usersWhoLikedPost.getUsersWhoLikedPost.data],
            total: usersWhoLikedPost.getUsersWhoLikedPost.total + 1
        }
    }

    return {
        usersWhoLikedPost: usersWhoLikedPostResult,
        success: true,
    }
}

interface RemoveUserWhoLikedPostOptions {
    usersWhoLikedPost: GetUsersWhoLikedPostQueryType
    userId: string
}

interface RemoveUserWhoLikedPostReturnValue {
    usersWhoLikedPost: GetUsersWhoLikedPostQueryType
    success: boolean
}

export function removeUserWhoLikedPost (options: RemoveUserWhoLikedPostOptions): RemoveUserWhoLikedPostReturnValue {
    const { usersWhoLikedPost, userId } = options

    const findUserWhoLikedPostIndex = usersWhoLikedPost.getUsersWhoLikedPost.data
        .findIndex(userWhoLikedPost => userWhoLikedPost.followableUser.user._id === userId)
    if (findUserWhoLikedPostIndex >= 0) {
        const newData = [...usersWhoLikedPost.getUsersWhoLikedPost.data]
        newData.splice(findUserWhoLikedPostIndex, 1)
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

export default {
    updateFollowingLoadingStatus,
    updateFollowingStatus,
    addUserWhoLikedPost,
    removeUserWhoLikedPost,
}