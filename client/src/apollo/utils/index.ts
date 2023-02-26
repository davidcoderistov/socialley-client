import {
    FollowedUserPost,
    LikingUser,
} from '../../types'
import { GetSuggestedUsersQueryType, SuggestedUser } from '../../graphql/queries/users'
import { GetUsersWhoLikedPostQueryType, UserWhoLikedPost } from '../../graphql/queries/posts'
import {
    FollowedUsersPostsQueryData,
    UsersWhoLikedCommentQueryData,
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

interface UpdateOneUserWhoLikedPostOptions {
    usersWhoLikedPost: GetUsersWhoLikedPostQueryType
    userId: string
    mapper: (userWhoLikedPost: UserWhoLikedPost) => UserWhoLikedPost
}

interface UpdateOneUserWhoLikedPostReturnValue {
    usersWhoLikedPost: GetUsersWhoLikedPostQueryType
    success: boolean
}

export function updateOneUserWhoLikedPost (options: UpdateOneUserWhoLikedPostOptions): UpdateOneUserWhoLikedPostReturnValue {
    const { usersWhoLikedPost, userId, mapper } = options

    let success = false
    const usersWhoLikedPostResult = {
        ...usersWhoLikedPost,
        getUsersWhoLikedPost: {
            ...usersWhoLikedPost.getUsersWhoLikedPost,
            data: usersWhoLikedPost.getUsersWhoLikedPost.data.map(userWhoLikedPost => {
                if (userWhoLikedPost.followableUser.user._id === userId) {
                    success = true
                    return mapper(userWhoLikedPost)
                }
                return userWhoLikedPost
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

interface UpdateOneSuggestedUserOptions {
    suggestedUsers: GetSuggestedUsersQueryType
    userId: string
    mapper: (suggestedUser: SuggestedUser) => SuggestedUser
}

interface UpdateOneSuggestedUserReturnValue {
    suggestedUsers: GetSuggestedUsersQueryType
    success: boolean
}

export function updateOneSuggestedUser (options: UpdateOneSuggestedUserOptions): UpdateOneSuggestedUserReturnValue {
    const { suggestedUsers, userId, mapper } = options

    let success = false
    const suggestedUsersResult = {
        ...suggestedUsers,
        getSuggestedUsers: suggestedUsers.getSuggestedUsers.map(suggestedUser => {
            if (suggestedUser.followableUser.user._id === userId) {
                success = true
                return mapper(suggestedUser)
            }
            return suggestedUser
        })
    }

    return {
        suggestedUsers: suggestedUsersResult,
        success,
    }
}