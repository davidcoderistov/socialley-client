import { FullMessage } from '../../models'


export interface CreateMessageMutationType {
    createMessage: Omit<FullMessage, 'temporary'>
}