import { FullMessage, Message } from '../../types'


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