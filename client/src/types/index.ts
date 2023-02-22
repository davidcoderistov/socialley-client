
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

export interface PostDetails {
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
        following: boolean
        isFollowingLoading: boolean
    }
    firstLikeUser: {
        _id: string
        username: string
    } | null
    liked: boolean
    isLikedLoading: boolean
    favorite: boolean
    isFavoriteLoading: boolean
    likesCount: number
    createdAt: number
}

export interface FollowedUserPost extends PostDetails {
    commentsCount: number
}

export interface LikingUser extends PublicUser {
    following: boolean
    isFollowingLoading: boolean
}


export interface SuggestedUser extends Omit<PublicUser, 'email'> {
    latestFollower: Pick<PublicUser, '_id' | 'username'>
    followedCount: number
    following: boolean
    isFollowingLoading: boolean
}

export interface Comment {
    _id: string
    text: string
    postId: string
    user: {
        _id: string
        firstName: string
        lastName: string
        username: string
        avatarURL: string | null
    }
    liked: boolean
    isLikedLoading: boolean
    likesCount: number
    createdAt: number
}