import { Post, PostLike, UserFavorite, CommentLike } from '../../models'


export interface CreatePostMutationType {
    createPost: Pick<Post, '_id' | 'title' | 'photoURL' | 'videoURL' | 'user' | 'createdAt'>
}

export interface LikePostMutationType {
    likePost: Omit<PostLike, 'createdAt'>
}

export interface UnlikePostMutationType {
    unlikePost: Omit<PostLike, 'createdAt'>
}

export interface MarkUserPostAsFavoriteMutationType {
    markUserPostAsFavorite: Omit<UserFavorite, 'createdAt'>
}

export interface UnmarkUserPostAsFavoriteMutationType {
    unmarkUserPostAsFavorite: Omit<UserFavorite, 'createdAt'>
}

export interface CreateCommentMutationType {
    createComment: {
        _id: string
        text: string
        postId: string
        userId: string
        createdAt: number
    }
}

export interface LikeCommentMutationType {
    likeComment: Omit<CommentLike, 'createdAt'>
}

export interface UnlikeCommentMutationType {
    unlikeComment: Omit<CommentLike, 'createdAt'>
}


