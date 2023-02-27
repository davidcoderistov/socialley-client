import { User, FollowedUserPost, UserWhoLikedPost, Comment, UserWhoLikedComment } from '../../models'


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