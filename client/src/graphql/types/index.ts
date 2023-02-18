import { FullMessage, Message, FollowedUserPost, LikingUser } from '../../types'


export interface LatestMessageQueryData {
    getLatestMessage: FullMessage | null
}

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