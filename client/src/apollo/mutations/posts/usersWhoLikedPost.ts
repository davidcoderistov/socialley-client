import { UsersWhoLikedPostQueryData } from '../../../graphql/types'


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
    const { usersWhoLikedPost, userId, isFollowingLoading } = options

    let success = false
    const usersWhoLikedPostResult = {
        ...usersWhoLikedPost,
        getUsersWhoLikedPost: {
            ...usersWhoLikedPost.getUsersWhoLikedPost,
            data: usersWhoLikedPost.getUsersWhoLikedPost.data.map(user => {
                if (user._id === userId) {
                    success = true
                    return {
                        ...user,
                        isFollowingLoading,
                    }
                }
                return user
            })
        }
    }

    return {
        usersWhoLikedPost: usersWhoLikedPostResult,
        success,
    }
}