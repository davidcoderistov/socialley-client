import { GetFollowedUsersPostsQueryType, FollowedUserPost } from '../../graphql/queries/posts'
import { GetSuggestedUsersQueryType, SuggestedUser } from '../../graphql/queries/users'
import { GetUsersWhoLikedPostQueryType, UserWhoLikedPost } from '../../graphql/queries/posts'
import { GetUsersWhoLikedCommentQueryType, UserWhoLikedComment } from '../../graphql/queries/posts'
import { GetCommentsForPostQueryType, Comment } from '../../graphql/queries/posts'


interface UpdateFollowedUserPostByPostIdOptions {
    followedUsersPosts: GetFollowedUsersPostsQueryType
    postId: string
    mapper: (followedUserPost: FollowedUserPost) => FollowedUserPost
}

interface UpdateFollowedUserPostByPostIdReturnValue {
    followedUsersPosts: GetFollowedUsersPostsQueryType
    success: boolean
}

export function updateOneFollowedUserPost (options: UpdateFollowedUserPostByPostIdOptions): UpdateFollowedUserPostByPostIdReturnValue {
    const { followedUsersPosts, postId, mapper } = options

    let success = false
    const followedUsersPostsResult = {
        ...followedUsersPosts,
        getFollowedUsersPosts: {
            ...followedUsersPosts.getFollowedUsersPosts,
            data: followedUsersPosts.getFollowedUsersPosts.data.map(followedUserPost => {
                if (followedUserPost.post._id === postId) {
                    success = true
                    return mapper(followedUserPost)
                }
                return followedUserPost
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

interface UpdateOneUserWhoLikedCommentOptions {
    usersWhoLikedComment: GetUsersWhoLikedCommentQueryType
    userId: string
    mapper: (userWhoLikedComment: UserWhoLikedComment) => UserWhoLikedComment
}

interface UpdateOneUserWhoLikedCommentReturnValue {
    usersWhoLikedComment: GetUsersWhoLikedCommentQueryType
    success: boolean
}

export function updateOneUserWhoLikedComment (options: UpdateOneUserWhoLikedCommentOptions): UpdateOneUserWhoLikedCommentReturnValue {
    const { usersWhoLikedComment, userId, mapper } = options

    let success = false
    const usersWhoLikedCommentResult = {
        ...usersWhoLikedComment,
        getUsersWhoLikedComment: {
            ...usersWhoLikedComment.getUsersWhoLikedComment,
            data: usersWhoLikedComment.getUsersWhoLikedComment.data.map(userWhoLikedComment => {
                if (userWhoLikedComment.followableUser.user._id  === userId) {
                    success = true
                    return mapper(userWhoLikedComment)
                }
                return userWhoLikedComment
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

interface UpdateOneCommentForPostOptions {
    commentsForPost: GetCommentsForPostQueryType
    commentId: string
    mapper: (commentForPost: Comment) => Comment
}

interface UpdateOneCommentForPostReturnValue {
    commentsForPost: GetCommentsForPostQueryType
    success: boolean
}

export function updateOneCommentForPost (options: UpdateOneCommentForPostOptions): UpdateOneCommentForPostReturnValue {
    const { commentsForPost, commentId, mapper } = options

    let success = false
    const commentsForPostResult = {
        ...commentsForPost,
        getCommentsForPost: {
            ...commentsForPost.getCommentsForPost,
            data: commentsForPost.getCommentsForPost.data.map(commentForPost => {
                if (commentForPost._id === commentId) {
                    success = true
                    return mapper(commentForPost)
                }
                return commentForPost
            })
        }
    }

    return {
        commentsForPost: commentsForPostResult,
        success,
    }
}