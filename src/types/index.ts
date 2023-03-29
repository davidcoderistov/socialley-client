
export interface User {
    _id: string
    firstName: string
    lastName: string
    username: string
    email: string
    avatarURL: string | null
    accessToken: string
}

export interface MessageUser {
    _id: string
    firstName: string
    lastName: string
    avatarURL: string | null
}

export interface PostDetails {
    _id: string
    title: string | null
    photoURL: string
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