
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