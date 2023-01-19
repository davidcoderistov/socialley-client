

export interface LatestMessage {
    messageId: string
    fromUser: {
        _id: string
        firstName: string
        lastName: string
    }
    toUser: {
        _id: string
        firstName: string
        lastName: string
    }
    message: string | null
    photoURL: string | null
    createdAt: number
}

export interface LatestMessagesQueryData {
    getLatestMessages: {
        data: LatestMessage[]
        total: number
    }
}

export interface LatestChatMessage {
    _id: string
    fromUserId: string
    toUserId: string
    message: string | null
    photoURL: string | null
    createdAt: number
}

export interface LatestChatMessagesQueryData {
    getLatestChatMessages: {
        data: LatestChatMessage[]
        total: number
    }
}