import { gql } from '@apollo/client'


export const CREATE_POST = gql`
    mutation createPost($post: CreatePostInput!) {
        createPost(post: $post) {
            post {
                _id
                title
                photoURL
                videoURL
                createdAt
            }
            user {
                _id
                firstName
                lastName
                username
                avatarURL
            }
            firstLikeUser {
                _id
                username
            }
            liked
            isLikedLoading @client
            favorite
            isFavoriteLoading @client
            likesCount
        }
    }
`

export const LIKE_POST = gql`
    mutation likePost($postId: String!) {
        likePost(postId: $postId) {
            _id
            postId
            userId
        }
    }
`

export const UNLIKE_POST = gql`
    mutation unlikePost($postId: String!) {
        unlikePost(postId: $postId) {
            _id
            postId
            userId
        }
    }
`

export const MARK_USER_POST_AS_FAVORITE = gql`
    mutation markUserPostAsFavorite($postId: String!) {
        markUserPostAsFavorite(postId: $postId) {
            _id
            postId
            userId
        }
    }
`

export const UNMARK_USER_POST_AS_FAVORITE = gql`
    mutation unmarkUserPostAsFavorite($postId: String!) {
        unmarkUserPostAsFavorite(postId: $postId) {
            _id
            postId
            userId
        }
    }
`

export const CREATE_COMMENT = gql`
    mutation createComment($comment: CreateCommentInput) {
        createComment(comment: $comment) {
            _id
            text
            postId
            userId
            createdAt
        }
    }
`

export const LIKE_COMMENT = gql`
    mutation likeComment($commentId: String!) {
        likeComment(commentId: $commentId) {
            _id
            commentId
            userId
        }
    }
`

export const UNLIKE_COMMENT = gql`
    mutation unlikeComment($commentId: String!) {
        unlikeComment(commentId: $commentId) {
            _id
            commentId
            userId
        }
    }
`