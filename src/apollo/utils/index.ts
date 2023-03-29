import {
    FollowedUserPost,
    UserWhoLikedPost,
    UserWhoLikedComment,
    SuggestedUser,
    Comment,
    FollowingUser,
    FollowerUser,
    SearchedUser,
    FollowNotification,
} from '../../graphql/types/models'
import {
    GetFollowedUsersPostsQueryType,
    GetUsersWhoLikedPostQueryType,
    GetUsersWhoLikedCommentQueryType,
    GetCommentsForPostQueryType,
} from '../../graphql/types/queries/posts'
import {
    GetSuggestedUsersQueryType,
    GetFollowingForUserQueryType,
    GetFollowersForUserQueryType,
    GetSearchedUsersQueryType,
    GetFollowNotificationsForUserQueryType,
} from '../../graphql/types/queries/users'


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
                if (followedUserPost.postDetails.post._id === postId) {
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
        getSuggestedUsers: {
            ...suggestedUsers.getSuggestedUsers,
            data: suggestedUsers.getSuggestedUsers.data.map(suggestedUser => {
                if (suggestedUser.followableUser.user._id === userId) {
                    success = true
                    return mapper(suggestedUser)
                }
                return suggestedUser
            })
        }
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

interface UpdateOneFollowingUserOptions {
    followingUsers: GetFollowingForUserQueryType
    userId: string
    mapper: (followingUser: FollowingUser) => FollowingUser
}

interface UpdateOneFollowingUserReturnValue {
    followingUsers: GetFollowingForUserQueryType
    success: boolean
}

export function updateOneFollowingUser (options: UpdateOneFollowingUserOptions): UpdateOneFollowingUserReturnValue {
    const { followingUsers, userId, mapper } = options

    let success = false
    const followingUsersResult = {
        ...followingUsers,
        getFollowingForUser: {
            ...followingUsers.getFollowingForUser,
            data: followingUsers.getFollowingForUser.data.map(followingUser => {
                if (followingUser.followableUser.user._id  === userId) {
                    success = true
                    return mapper(followingUser)
                }
                return followingUser
            })
        }
    }

    return {
        followingUsers: followingUsersResult,
        success,
    }
}

interface UpdateOneFollowerUserOptions {
    followerUsers: GetFollowersForUserQueryType
    userId: string
    mapper: (followerUser: FollowerUser) => FollowerUser
}

interface UpdateOneFollowerUserReturnValue {
    followerUsers: GetFollowersForUserQueryType
    success: boolean
}

export function updateOneFollowerUser (options: UpdateOneFollowerUserOptions): UpdateOneFollowerUserReturnValue {
    const { followerUsers, userId, mapper } = options

    let success = false
    const followerUsersResult = {
        ...followerUsers,
        getFollowersForUser: {
            ...followerUsers.getFollowersForUser,
            data: followerUsers.getFollowersForUser.data.map(followerUser => {
                if (followerUser.followableUser.user._id  === userId) {
                    success = true
                    return mapper(followerUser)
                }
                return followerUser
            })
        }
    }

    return {
        followerUsers: followerUsersResult,
        success,
    }
}

interface UpdateOneSearchedUserOptions {
    searchedUsers: GetSearchedUsersQueryType
    userId: string
    mapper: (searchedUser: SearchedUser) => SearchedUser
}

interface UpdateOneSearchedUserReturnValue {
    searchedUsers: GetSearchedUsersQueryType
    success: boolean
}

export function updateOneSearchedUser (options: UpdateOneSearchedUserOptions): UpdateOneSearchedUserReturnValue {
    const { searchedUsers, userId, mapper } = options

    let success = false
    const searchedUsersResult = {
        ...searchedUsers,
        getSearchedUsers: searchedUsers.getSearchedUsers.map(searchedUser => {
            if (searchedUser.followableUser.user._id === userId) {
                success = true
                return mapper(searchedUser)
            }
            return searchedUser
        })
    }

    return {
        searchedUsers: searchedUsersResult,
        success,
    }
}

interface UpdateOneFollowNotificationOptions {
    followNotificationsForUser: GetFollowNotificationsForUserQueryType
    userId: string
    mapper: (followNotification: FollowNotification) => FollowNotification
}

interface UpdateOneFollowNotificationReturnValue {
    followNotificationsForUser: GetFollowNotificationsForUserQueryType
    success: boolean
}

export function updateOneFollowNotification (options: UpdateOneFollowNotificationOptions): UpdateOneFollowNotificationReturnValue {
    const { followNotificationsForUser, userId, mapper } = options

    let success = false
    const followNotificationsResult = {
        ...followNotificationsForUser,
        getFollowNotificationsForUser: {
            ...followNotificationsForUser.getFollowNotificationsForUser,
            data: followNotificationsForUser.getFollowNotificationsForUser.data.map(followNotification => {
                if (followNotification.followableUser.user._id === userId) {
                    success = true
                    return mapper(followNotification)
                }
                return followNotification
            })
        }
    }

    return {
        followNotificationsForUser: followNotificationsResult,
        success,
    }
}