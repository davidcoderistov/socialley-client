import { User, FollowedUserPost, UserWhoLikedPost, Comment, UserWhoLikedComment, Post, PostDetails } from '../../models'


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
    getPostsForUser: {
        data: Omit<Post, 'createdAt'>[]
        total: number
    }
}

export interface GetLikedPostsForUserQueryType {
    getLikedPostsForUser: {
        data: Omit<Post, 'createdAt'>[]
        total: number
    }
}

export interface GetFavoritePostsForUserQueryType {
    getFavoritePostsForUser: {
        data: Omit<Post, 'createdAt'>[]
        total: number
    }
}

export interface GetPostDetailsQueryType {
    getPostDetails: PostDetails
}