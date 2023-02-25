

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