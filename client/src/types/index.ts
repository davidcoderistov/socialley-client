
export interface User {
    _id: string
    firstName: string
    lastName: string
    username: string
    email: string
    accessToken: string
}

export interface Message {
    _id: string
    fromUserId: string
    toUserId: string
    message: string | null
    photoURL: string | null
    createdAt: number
}