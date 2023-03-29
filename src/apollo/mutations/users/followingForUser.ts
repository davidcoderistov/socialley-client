import { GetFollowingForUserQueryType } from '../../../graphql/types/queries/users'
import { updateOneFollowingUser } from '../../utils'
import { FollowingUser } from '../../../graphql/types/models'


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

interface AddFollowingUserOptions {
    followingUsers: GetFollowingForUserQueryType
    followingUser: FollowingUser
}

interface AddFollowingUserReturnValue {
    followingUsers: GetFollowingForUserQueryType
    success: boolean
}

export function addFollowingUser (options: AddFollowingUserOptions): AddFollowingUserReturnValue {
    const { followingUsers, followingUser } = options

    return {
        followingUsers: {
            ...followingUsers,
            getFollowingForUser: {
                ...followingUsers.getFollowingForUser,
                data: [followingUser, ...followingUsers.getFollowingForUser.data],
            }
        },
        success: true,
    }
}

interface RemoveFollowingUserOptions {
    followingUsers: GetFollowingForUserQueryType
    userId: string
}

interface RemoveFollowingUserReturnValue {
    followingUsers: GetFollowingForUserQueryType
    success: boolean
}

export function removeFollowingUser (options: RemoveFollowingUserOptions): RemoveFollowingUserReturnValue {
    const { followingUsers, userId } = options

    const findFollowingUserId = followingUsers.getFollowingForUser.data
        .findIndex(followingUser => followingUser.followableUser.user._id === userId)

    if (findFollowingUserId >= 0) {
        const newFollowingUsers = [...followingUsers.getFollowingForUser.data]
        newFollowingUsers.splice(findFollowingUserId, 1)
        return {
            followingUsers: {
                ...followingUsers,
                getFollowingForUser: {
                    ...followingUsers.getFollowingForUser,
                    data: newFollowingUsers,
                }
            },
            success: true,
        }
    }
    return {
        followingUsers,
        success: false,
    }
}

export default {
    updateFollowingLoadingStatus,
    updateFollowingStatus,
    addFollowingUser,
    removeFollowingUser,
}