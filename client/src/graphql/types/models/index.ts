

export interface User {
    _id: string
    firstName: string
    lastName: string
    username: string
    email: string
    avatarURL: string | null
}

export interface AuthUser {
    user: User
    accessToken: string
}

export interface FollowableUser {
    user: User
    following: boolean
}

export interface SuggestedUser {
    followableUser: FollowableUser
    latestFollower: Pick<User, '_id' | 'username'> | null
    followedCount: number
    isFollowingLoading: boolean
}

export interface Follow {
    _id: string
    followingUserId: string
    followedUserId: string
    createdAt: number
}

export interface UserFavorite {
    _id: string
    postId: string
    userId: string
    createdAt: number
}

export interface Message {
    _id: string
    fromUserId: string
    toUserId: string
    message: string | null
    photoURL: string | null
    temporary: boolean
    createdAt: number
}

export interface FullMessage {
    _id: string
    fromUser: Omit<User, 'email'>
    toUser: Omit<User, 'email'>
    message: string | null
    photoURL: string | null
    temporary: boolean
    createdAt: number
}

export interface Comment {
    _id: string
    text: string
    postId: string
    user: Omit<User, 'email'>
    liked: boolean
    isLikedLoading: boolean
    likesCount: number
    createdAt: number
}

export interface CommentLike {
    _id: string
    commentId: string
    userId: string
    createdAt: number
}

export interface Post {
    _id: string
    title: string | null
    photoURL: string
    videoURL: string | null
    user: Omit<User, 'email'>
    firstLikeUser: Pick<User, '_id' | 'username'> | null
    liked: boolean
    isLikedLoading: boolean
    favorite: boolean
    isFavoriteLoading: boolean
    likesCount: number
    createdAt: number
}

export interface FollowedUserPost {
    post: Post
    commentsCount: number
}

export interface PostLike {
    _id: string
    postId: string
    userId: string
    createdAt: number
}

export interface UserWhoLikedPost {
    followableUser: FollowableUser
    isFollowingLoading: boolean
}

export interface UserWhoLikedComment {
    followableUser: FollowableUser
    isFollowingLoading: boolean
}