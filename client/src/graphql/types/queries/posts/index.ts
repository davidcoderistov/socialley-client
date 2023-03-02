import { User, FollowedUserPost, UserWhoLikedPost, Comment, UserWhoLikedComment, Post } from '../../models'


export interface GetFollowedUsersPostsQueryType {
    getFollowedUsersPosts: {
        data: FollowedUserPost[]
        total: number
    }
}

export interface GetUsersWhoLikedPostQueryType {
    getUsersWhoLikedPost: {
        data: UserWhoLikedPost[]
        total: number
    }
}

export interface GetFirstUserWhoLikedPostQueryType {
    getFirstUserWhoLikedPost: User | null
}

export interface GetCommentsForPostQueryType {
    getCommentsForPost: {
        data: Comment[]
        total: number
    }
}

export interface GetUsersWhoLikedCommentQueryType {
    getUsersWhoLikedComment: {
        data: UserWhoLikedComment[]
        total: number
    }
}

export interface GetPostsForUserQueryType {
    getPostsForUser: Omit<Post, 'createdAt'>
}