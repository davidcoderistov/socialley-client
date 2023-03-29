import { GetFollowedUsersPostsQueryType } from '../../../graphql/types/queries/posts'
import { PostDetails } from '../../../graphql/types/models'
import { updateOneFollowedUserPost } from '../../utils'


interface UpdateFollowedUserPostLikedLoadingStatusOptions {
    followedUsersPosts: GetFollowedUsersPostsQueryType
    postId: string
    isLikedLoading: boolean
}

interface UpdateFollowedUserPostLikedLoadingStatusReturnValue {
    followedUsersPosts: GetFollowedUsersPostsQueryType
    success: boolean
}

export function updateFollowedUserPostLikedLoadingStatus (options: UpdateFollowedUserPostLikedLoadingStatusOptions): UpdateFollowedUserPostLikedLoadingStatusReturnValue {
    return updateOneFollowedUserPost({
        followedUsersPosts: options.followedUsersPosts,
        postId: options.postId,
        mapper (followedUserPost) {
            return {
                ...followedUserPost,
                postDetails: {
                    ...followedUserPost.postDetails,
                    isLikedLoading: options.isLikedLoading,
                }
            }
        }
    })
}

interface UpdateFollowedUserPostLikedStatusOptions {
    followedUsersPosts: GetFollowedUsersPostsQueryType
    postId: string
    liked: boolean
    firstLikeUser: {
        _id: string
        username: string
    } | null
}

interface UpdateFollowedUserPostLikedStatusReturnValue {
    followedUsersPosts: GetFollowedUsersPostsQueryType
    success: boolean
}

export function updateFollowedUserPostLikedStatus (options: UpdateFollowedUserPostLikedStatusOptions): UpdateFollowedUserPostLikedStatusReturnValue {
    return updateOneFollowedUserPost({
        followedUsersPosts: options.followedUsersPosts,
        postId: options.postId,
        mapper (followedUserPost) {
            return {
                ...followedUserPost,
                postDetails: {
                    ...followedUserPost.postDetails,
                    liked: options.liked,
                    firstLikeUser: options.firstLikeUser,
                    likesCount: options.liked ? followedUserPost.postDetails.likesCount + 1 : followedUserPost.postDetails.likesCount - 1,
                    isLikedLoading: false,
                }
            }
        }
    })
}

interface UpdateFollowedUserPostFollowingLoadingStatusOptions {
    followedUsersPosts: GetFollowedUsersPostsQueryType
    userId: string
    isFollowingLoading: boolean
}

interface UpdateFollowedUserPostFollowingLoadingStatusReturnValue {
    followedUsersPosts: GetFollowedUsersPostsQueryType
}

export function updateFollowedUserPostsFollowingLoadingStatus (options: UpdateFollowedUserPostFollowingLoadingStatusOptions): UpdateFollowedUserPostFollowingLoadingStatusReturnValue {
    const { followedUsersPosts, userId, isFollowingLoading } = options

    return {
        followedUsersPosts: {
            ...followedUsersPosts,
            getFollowedUsersPosts: {
                ...followedUsersPosts.getFollowedUsersPosts,
                data: followedUsersPosts.getFollowedUsersPosts.data.map(followedUserPost => {
                    if (followedUserPost.postDetails.followableUser.user._id === userId) {
                        return {
                            ...followedUserPost,
                            postDetails: {
                                ...followedUserPost.postDetails,
                                isFollowingLoading,
                            }
                        }
                    }
                    return followedUserPost
                })
            }
        }
    }
}

interface UpdateFollowedUserPostFollowingStatusOptions {
    followedUsersPosts: GetFollowedUsersPostsQueryType
    userId: string
    following: boolean
}

interface UpdateFollowedUserPostFollowingStatusReturnValue {
    followedUsersPosts: GetFollowedUsersPostsQueryType
}

export function updateFollowedUserPostsFollowingStatus (options: UpdateFollowedUserPostFollowingStatusOptions): UpdateFollowedUserPostFollowingStatusReturnValue {
    const { followedUsersPosts, userId, following } = options

    return {
        followedUsersPosts: {
            ...followedUsersPosts,
            getFollowedUsersPosts: {
                ...followedUsersPosts.getFollowedUsersPosts,
                data: followedUsersPosts.getFollowedUsersPosts.data.map(followedUserPost => {
                    if (followedUserPost.postDetails.followableUser.user._id === userId) {
                        return {
                            ...followedUserPost,
                            postDetails: {
                                ...followedUserPost.postDetails,
                                followableUser: {
                                    ...followedUserPost.postDetails.followableUser,
                                    following,
                                },
                                isFollowingLoading: false,
                            }
                        }
                    }
                    return followedUserPost
                })
            }
        }
    }
}

interface UpdateFollowedUserPostFavoriteLoadingStatusOptions {
    followedUsersPosts: GetFollowedUsersPostsQueryType
    postId: string
    isFavoriteLoading: boolean
}

interface UpdateFollowedUserPostFavoriteLoadingStatusReturnValue {
    followedUsersPosts: GetFollowedUsersPostsQueryType
    success: boolean
}

export function updateFollowedUserPostFavoriteLoadingStatus (options: UpdateFollowedUserPostFavoriteLoadingStatusOptions): UpdateFollowedUserPostFavoriteLoadingStatusReturnValue {
    return updateOneFollowedUserPost({
        followedUsersPosts: options.followedUsersPosts,
        postId: options.postId,
        mapper (followedUserPost) {
            return {
                ...followedUserPost,
                postDetails: {
                    ...followedUserPost.postDetails,
                    isFavoriteLoading: options.isFavoriteLoading,
                }
            }
        }
    })
}

interface UpdateFollowedUserPostFavoriteStatusOptions {
    followedUsersPosts: GetFollowedUsersPostsQueryType
    postId: string
    favorite: boolean
}

interface UpdateFollowedUserPostFavoriteStatusReturnValue {
    followedUsersPosts: GetFollowedUsersPostsQueryType
    success: boolean
}

export function updateFollowedUserPostFavoriteStatus (options: UpdateFollowedUserPostFavoriteStatusOptions): UpdateFollowedUserPostFavoriteStatusReturnValue {
    return updateOneFollowedUserPost({
        followedUsersPosts: options.followedUsersPosts,
        postId: options.postId,
        mapper (followedUserPost) {
            return {
                ...followedUserPost,
                postDetails: {
                    ...followedUserPost.postDetails,
                    favorite: options.favorite,
                    isFavoriteLoading: false,
                }
            }
        }
    })
}

interface IncrementFollowedUserPostCommentsCountOptions {
    followedUsersPosts: GetFollowedUsersPostsQueryType
    postId: string
}

interface IncrementFollowedUserPostCommentsCountReturnValue {
    followedUsersPosts: GetFollowedUsersPostsQueryType
    success: boolean
}

export function incrementFollowedUserPostCommentsCount (options: IncrementFollowedUserPostCommentsCountOptions): IncrementFollowedUserPostCommentsCountReturnValue {
    return updateOneFollowedUserPost({
        followedUsersPosts: options.followedUsersPosts,
        postId: options.postId,
        mapper (followedUserPost) {
            return {
                ...followedUserPost,
                commentsCount: followedUserPost.commentsCount + 1
            }
        }
    })
}

interface AddFollowedUserPostOptions {
    followedUsersPosts: GetFollowedUsersPostsQueryType
    postDetails: PostDetails
}

interface AddFollowedUserPostReturnValue {
    followedUsersPosts: GetFollowedUsersPostsQueryType
    success: boolean
}

export function addFollowedUserPost (options: AddFollowedUserPostOptions): AddFollowedUserPostReturnValue {
    return {
        followedUsersPosts: {
            ...options.followedUsersPosts,
            getFollowedUsersPosts: {
                ...options.followedUsersPosts.getFollowedUsersPosts,
                data: [{ postDetails: { ...options.postDetails }, commentsCount: 0 }, ...options.followedUsersPosts.getFollowedUsersPosts.data],
            }
        },
        success: true,
    }
}