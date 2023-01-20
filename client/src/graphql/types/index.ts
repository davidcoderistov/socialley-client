import { FullMessage, Message } from '../../types'


export interface LatestMessagesQueryData {
    getLatestMessages: {
        data: FullMessage[]
        total: number
    }
}

export interface LatestChatMessagesQueryData {
    getLatestChatMessages: {
        data: Message[]
        total: number
    }
}