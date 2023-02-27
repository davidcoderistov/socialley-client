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

export interface GetLatestMessagesCountQueryType {
    getLatestMessagesCount: {
        count: number
    }
}

export interface GetLatestChatMessagesQueryType {
    getLatestChatMessages: {
        data: Message[]
        total: number
    }
}