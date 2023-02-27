import { Message, FullMessage } from '../../models'


export interface GetLatestMessageQueryType {
    getLatestMessage: Omit<FullMessage, 'temporary'>
}

export interface GetLatestMessagesQueryType {
    getLatestMessages: {
        data: FullMessage[]
        total: number
    }
}

export interface GetLatestMessagesCount {
    getLatestMessagesCount: {
        count: number
    }
}

export interface GetLatestChatMessages {
    getLatestChatMessages: {
        data: Message[]
        total: number
    }
}