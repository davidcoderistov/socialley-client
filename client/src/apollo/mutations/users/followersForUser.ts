import { GetFollowersForUserQueryType } from '../../../graphql/types/queries/users'
import { updateOneFollowerUser } from '../../utils'
import { FollowerUser } from '../../../graphql/types/models'


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

interface AddFollowerUserOptions {
    followerUsers: GetFollowersForUserQueryType
    followerUser: FollowerUser
}

interface AddFollowerUserReturnValue {
    followerUsers: GetFollowersForUserQueryType
    success: boolean
}

export function addFollowerUser (options: AddFollowerUserOptions): AddFollowerUserReturnValue {
    const { followerUsers, followerUser } = options

    return {
        followerUsers: {
            ...followerUsers,
            getFollowersForUser: {
                ...followerUsers.getFollowersForUser,
                data: [followerUser, ...followerUsers.getFollowersForUser.data],
            }
        },
        success: true,
    }
}

interface RemoveFollowerUserOptions {
    followerUsers: GetFollowersForUserQueryType
    userId: string
}

interface RemoveFollowerUserReturnValue {
    followerUsers: GetFollowersForUserQueryType
    success: boolean
}

export function removeFollowerUser (options: RemoveFollowerUserOptions): RemoveFollowerUserReturnValue {
    const { followerUsers, userId } = options

    const findFollowerUserId = followerUsers.getFollowersForUser.data
        .findIndex(followerUser => followerUser.followableUser.user._id === userId)

    if (findFollowerUserId >= 0) {
        const newFollowerUsers = [...followerUsers.getFollowersForUser.data]
        newFollowerUsers.splice(findFollowerUserId, 1)
        return {
            followerUsers: {
                ...followerUsers,
                getFollowersForUser: {
                    ...followerUsers.getFollowersForUser,
                    data: newFollowerUsers,
                }
            },
            success: true,
        }
    }
    return {
        followerUsers,
        success: false,
    }
}

export default {
    updateFollowingLoadingStatus,
    updateFollowingStatus,
    addFollowerUser,
    removeFollowerUser,
}