import { FollowedUserPost, LikingUser } from '../../types'
import { FollowedUsersPostsQueryData, UsersWhoLikedPostQueryData } from '../../graphql/types'


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

interface UpdateLikingUserByUserIdOptions {
    usersWhoLikedPost: UsersWhoLikedPostQueryData
    userId: string
    likingUser: Partial<LikingUser>
}

interface UpdateLikingUserByUserIdReturnValue {
    usersWhoLikedPost: UsersWhoLikedPostQueryData
    success: boolean
}

export function updateLikingUserByUserId (options: UpdateLikingUserByUserIdOptions): UpdateLikingUserByUserIdReturnValue {
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