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
                total: options.followedUsersPosts.getFollowedUsersPosts.total + 1,
            }
        },
        success: true,
    }
}

interface RemoveFollowedUserPostOptions {
    followedUsersPosts: GetFollowedUsersPostsQueryType
    userId: string
}

interface RemoveFollowedUserPostReturnValue {
    followedUsersPosts: GetFollowedUsersPostsQueryType
    success: boolean
}

export function removeFollowedUserPost (options: RemoveFollowedUserPostOptions): RemoveFollowedUserPostReturnValue {
    const { followedUsersPosts, userId } = options

    const findFollowedUserPostIndex = followedUsersPosts.getFollowedUsersPosts.data.findIndex(
        followedUsersPost => followedUsersPost.postDetails.user._id === userId)
    if (findFollowedUserPostIndex >= 0) {
        const newFollowedUsersPosts = [...followedUsersPosts.getFollowedUsersPosts.data]
        newFollowedUsersPosts.splice(findFollowedUserPostIndex, 1)
        return {
            followedUsersPosts: {
                ...followedUsersPosts,
                getFollowedUsersPosts: {
                    ...followedUsersPosts.getFollowedUsersPosts,
                    data: newFollowedUsersPosts,
                    total: followedUsersPosts.getFollowedUsersPosts.total - 1,
                }
            },
            success: true,
        }
    }

    return {
        followedUsersPosts,
        success: false,
    }
}