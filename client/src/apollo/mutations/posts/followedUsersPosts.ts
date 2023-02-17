import { FollowedUsersPostsQueryData } from '../../../graphql/types'
import { updateFollowedUserPostByPostId } from '../../utils'


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
    return updateFollowedUserPostByPostId({
        followedUsersPosts: options.followedUsersPosts,
        postId: options.postId,
        post: { liked: options.liked }
    })
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
    return updateFollowedUserPostByPostId({
        followedUsersPosts: options.followedUsersPosts,
        postId: options.postId,
        post: { favorite: options.favorite }
    })
}