import { FollowedUsersPostsQueryData } from '../../../graphql/types'


interface UpdateFollowedUserPostLikedStatus {
    followedUsersPosts: FollowedUsersPostsQueryData
    postId: string
    liked: boolean
}

interface UpdateFollowedUserPostLikedStatusReturnValue {
    followedUsersPosts: FollowedUsersPostsQueryData
    success: boolean
}

export function updateFollowedUserPostLikedStatus (options: UpdateFollowedUserPostLikedStatus): UpdateFollowedUserPostLikedStatusReturnValue {
    const { followedUsersPosts, postId, liked } = options

    let success = false
    const followedUsersPostsResult = {
        ...followedUsersPosts,
        getFollowedUsersPostsPaginated: {
            ...followedUsersPosts.getFollowedUsersPostsPaginated,
            data: followedUsersPosts.getFollowedUsersPostsPaginated.data.map(post => {
                if (post._id === postId) {
                    success = true
                    return {
                        ...post,
                        liked,
                    }
                }
                return post
            })
        }
    }

    return {
        followedUsersPosts: followedUsersPostsResult,
        success,
    }
}

interface UpdateFollowedUserPostFavoriteStatus {
    followedUsersPosts: FollowedUsersPostsQueryData
    postId: string
    favorite: boolean
}

interface UpdateFollowedUserPostFavoriteStatusReturnValue {
    followedUsersPosts: FollowedUsersPostsQueryData
    success: boolean
}

export function updateFollowedUserPostFavoriteStatus (options: UpdateFollowedUserPostFavoriteStatus): UpdateFollowedUserPostFavoriteStatusReturnValue {
    const { followedUsersPosts, postId, favorite } = options

    let success = false
    const followedUsersPostsResult = {
        ...followedUsersPosts,
        getFollowedUsersPostsPaginated: {
            ...followedUsersPosts.getFollowedUsersPostsPaginated,
            data: followedUsersPosts.getFollowedUsersPostsPaginated.data.map(post => {
                if (post._id === postId) {
                    success = true
                    return {
                        ...post,
                        favorite,
                    }
                }
                return post
            })
        }
    }

    return {
        followedUsersPosts: followedUsersPostsResult,
        success,
    }
}