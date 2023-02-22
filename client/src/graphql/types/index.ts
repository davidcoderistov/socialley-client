import { FullMessage, Message, FollowedUserPost, LikingUser, Comment, SuggestedUser } from '../../types'


export interface LatestMessagesQueryData {
    getLatestMessages: {
        data: FullMessage[]
        total: number
    }
}

export interface LatestMessagesCountQueryData {
    getLatestMessagesCount: {
        count: number
    }
}

export interface LatestChatMessagesQueryData {
    getLatestChatMessages: {
        data: Message[]
        total: number
    }
}

export interface ImageQueryData {
    getImage: string
}

interface UserBySearchQuery {
    _id: string
    username: string
    firstName: string
    lastName: string
    avatarURL?: string | null
}

export interface UsersBySearchQueryData {
    getUsersBySearchQuery: UserBySearchQuery[]
}

export interface FollowedUsersPostsQueryData {
    getFollowedUsersPostsPaginated: {
        data: FollowedUserPost[]
        total: number
    }
}

export interface UsersWhoLikedPostQueryData {
    getUsersWhoLikedPost: {
        data: LikingUser[]
        total: number
    }
}

export interface UnfollowUserMutationData {
    unfollowUser: {
        _id: string
    } | null
}

export interface FirstLikingUserForPostQueryData {
    getFirstLikingUserForPost: {
        _id: string
        username: string
    } | null
}

export interface CommentsForPostQueryData {
    getCommentsForPost: {
        data: Comment[]
        total: number
    }
}

export interface UsersWhoLikedCommentQueryData {
    getUsersWhoLikedComment: {
        data: LikingUser[]
        total: number
    }
}

export interface CreateCommentMutationData {
    createComment: {
        _id: string
        text: string
        postId: string
        userId: string
        createdAt: number
    }
}

export interface SuggestedUsersQueryData {
    getSuggestedUsers: SuggestedUser[]
}