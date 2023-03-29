import { PostLikeNotification, PostCommentNotification } from '../../models'


export interface PostLikedSubscriptionType {
    postLiked: PostLikeNotification
}

export interface PostCommentedSubscriptionType {
    postCommented: PostCommentNotification
}