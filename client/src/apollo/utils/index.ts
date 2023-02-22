import {
    FollowedUserPost,
    LikingUser,
    SuggestedUser
} from '../../types'
import {
    FollowedUsersPostsQueryData,
    UsersWhoLikedPostQueryData,
    UsersWhoLikedCommentQueryData,
    SuggestedUsersQueryData
} from '../../graphql/types'


interface UpdateFollowedUserPostByPostIdOptions {
    followedUsersPosts: FollowedUsersPostsQueryData
    postId: string
    post: Partial<FollowedUserPost>
}

interface UpdateFollowedUserPostByPostIdReturnValue {
    followedUsersPosts: FollowedUsersPostsQueryData
    success: boolean
}

export function updateFollowedUserPostByPostId (options: UpdateFollowedUserPostByPostIdOptions): UpdateFollowedUserPostByPostIdReturnValue {
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
                        ...options.post,
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

interface UpdatePostLikingUserByUserIdOptions {
    usersWhoLikedPost: UsersWhoLikedPostQueryData
    userId: string
    likingUser: Partial<LikingUser>
}

interface UpdatePostLikingUserByUserIdReturnValue {
    usersWhoLikedPost: UsersWhoLikedPostQueryData
    success: boolean
}

export function updatePostLikingUserByUserId (options: UpdatePostLikingUserByUserIdOptions): UpdatePostLikingUserByUserIdReturnValue {
    const { usersWhoLikedPost, userId, likingUser } = options

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
                        ...likingUser,
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

interface UpdateCommentLikingUserByUserIdOptions {
    usersWhoLikedComment: UsersWhoLikedCommentQueryData
    userId: string
    likingUser: Partial<LikingUser>
}

interface UpdateCommentLikingUserByUserIdReturnValue {
    usersWhoLikedComment: UsersWhoLikedCommentQueryData
    success: boolean
}

export function updateCommentLikingUserByUserId (options: UpdateCommentLikingUserByUserIdOptions): UpdateCommentLikingUserByUserIdReturnValue {
    const { usersWhoLikedComment, userId, likingUser } = options

    let success = false
    const usersWhoLikedCommentResult = {
        ...usersWhoLikedComment,
        getUsersWhoLikedComment: {
            ...usersWhoLikedComment.getUsersWhoLikedComment,
            data: usersWhoLikedComment.getUsersWhoLikedComment.data.map(user => {
                if (user._id === userId) {
                    success = true
                    return {
                        ...user,
                        ...likingUser,
                    }
                }
                return user
            })
        }
    }

    return {
        usersWhoLikedComment: usersWhoLikedCommentResult,
        success,
    }
}

interface UpdateSuggestedUserByUserIdOptions {
    suggestedUsers: SuggestedUsersQueryData
    userId: string
    suggestedUser: Partial<SuggestedUser>
}

interface UpdateSuggestedUserByUserIdReturnValue {
    suggestedUsers: SuggestedUsersQueryData
    success: boolean
}

export function updateSuggestedUserByUserId (options: UpdateSuggestedUserByUserIdOptions): UpdateSuggestedUserByUserIdReturnValue {
    const { suggestedUsers, userId, suggestedUser } = options

    let success = false
    const suggestedUsersResult = {
        ...suggestedUsers,
        getSuggestedUsers: suggestedUsers.getSuggestedUsers.map(user => {
            if (user._id === userId) {
                success = true
                return {
                    ...user,
                    ...suggestedUser,
                }
            }
            return user
        })
    }

    return {
        suggestedUsers: suggestedUsersResult,
        success,
    }
}