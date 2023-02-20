import { FollowedUsersPostsQueryData } from '../../../graphql/types'
import { updateFollowedUserPostByPostId } from '../../utils'


interface UpdateFollowedUserPostLikedLoadingStatusOptions {
    followedUsersPosts: FollowedUsersPostsQueryData
    postId: string
    isLikedLoading: boolean
}

interface UpdateFollowedUserPostLikedLoadingStatusReturnValue {
    followedUsersPosts: FollowedUsersPostsQueryData
    success: boolean
}

export function updateFollowedUserPostLikedLoadingStatus (options: UpdateFollowedUserPostLikedLoadingStatusOptions): UpdateFollowedUserPostLikedLoadingStatusReturnValue {
    return updateFollowedUserPostByPostId({
        followedUsersPosts: options.followedUsersPosts,
        postId: options.postId,
        post: { isLikedLoading: options.isLikedLoading }
    })
}

interface UpdateFollowedUserPostLikedStatusOptions {
    followedUsersPosts: FollowedUsersPostsQueryData
    postId: string
    liked: boolean
    firstLikeUser: {
        _id: string
        username: string
    } | null
}

interface UpdateFollowedUserPostLikedStatusReturnValue {
    followedUsersPosts: FollowedUsersPostsQueryData
    success: boolean
}

export function updateFollowedUserPostLikedStatus (options: UpdateFollowedUserPostLikedStatusOptions): UpdateFollowedUserPostLikedStatusReturnValue {
    const { followedUsersPosts, postId, liked, firstLikeUser } = options

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
                        firstLikeUser,
                        likesCount: liked ? post.likesCount + 1 : post.likesCount - 1,
                        isLikedLoading: false,
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

interface UpdateFollowedUserPostFavoriteLoadingStatusOptions {
    followedUsersPosts: FollowedUsersPostsQueryData
    postId: string
    isFavoriteLoading: boolean
}

interface UpdateFollowedUserPostFavoriteLoadingStatusReturnValue {
    followedUsersPosts: FollowedUsersPostsQueryData
    success: boolean
}

export function updateFollowedUserPostFavoriteLoadingStatus (options: UpdateFollowedUserPostFavoriteLoadingStatusOptions): UpdateFollowedUserPostFavoriteLoadingStatusReturnValue {
    return updateFollowedUserPostByPostId({
        followedUsersPosts: options.followedUsersPosts,
        postId: options.postId,
        post: { isFavoriteLoading: options.isFavoriteLoading }
    })
}

interface UpdateFollowedUserPostFavoriteStatusOptions {
    followedUsersPosts: FollowedUsersPostsQueryData
    postId: string
    favorite: boolean
}

interface UpdateFollowedUserPostFavoriteStatusReturnValue {
    followedUsersPosts: FollowedUsersPostsQueryData
    success: boolean
}

export function updateFollowedUserPostFavoriteStatus (options: UpdateFollowedUserPostFavoriteStatusOptions): UpdateFollowedUserPostFavoriteStatusReturnValue {
    return updateFollowedUserPostByPostId({
        followedUsersPosts: options.followedUsersPosts,
        postId: options.postId,
        post: { favorite: options.favorite, isFavoriteLoading: false }
    })
}

interface IncrementFollowedUserPostCommentsCountOptions {
    followedUsersPosts: FollowedUsersPostsQueryData
    postId: string
}

interface IncrementFollowedUserPostCommentsCountReturnValue {
    followedUsersPosts: FollowedUsersPostsQueryData
    success: boolean
}

export function incrementFollowedUserPostCommentsCount (options: IncrementFollowedUserPostCommentsCountOptions): IncrementFollowedUserPostCommentsCountReturnValue {
    const { followedUsersPosts, postId } = options

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
                        commentsCount: post.commentsCount + 1
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