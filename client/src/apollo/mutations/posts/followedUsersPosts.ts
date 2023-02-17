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
}

interface UpdateFollowedUserPostLikedStatusReturnValue {
    followedUsersPosts: FollowedUsersPostsQueryData
    success: boolean
}

export function updateFollowedUserPostLikedStatus (options: UpdateFollowedUserPostLikedStatusOptions): UpdateFollowedUserPostLikedStatusReturnValue {
    return updateFollowedUserPostByPostId({
        followedUsersPosts: options.followedUsersPosts,
        postId: options.postId,
        post: { liked: options.liked, isLikedLoading: false }
    })
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