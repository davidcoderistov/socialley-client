
export interface User {
    _id: string
    firstName: string
    lastName: string
    username: string
    email: string
    avatarURL: string | null
    accessToken: string
}

export interface PublicUser {
    _id: string
    firstName: string
    lastName: string
    username: string
    email: string
    avatarURL: string | null
}

export interface Message {
    _id: string
    fromUserId: string
    toUserId: string
    message: string | null
    photoURL: string | null
    createdAt: number
    temporary: boolean
}

export interface MessageUser {
    _id: string
    firstName: string
    lastName: string
    avatarURL: string | null
}

export interface FullMessage {
    _id: string
    fromUser: MessageUser
    toUser: MessageUser
    message: string | null
    photoURL: string | null
    createdAt: number
    temporary: boolean
}

export interface FollowedUserPost {
    _id: string
    title: string | null
    photoURL: string
    videoURL: string | null
    user: {
        _id: string
        firstName: string
        lastName: string
        username: string
        avatarURL: string | null
    }
    firstLikeUser: {
        _id: string
        username: string
    } | null
    liked: boolean
    likesCount: number
    commentsCount: number
    createdAt: number
}

export interface LikingUser extends PublicUser {
    following: boolean
    isFollowingLoading: boolean
}