import { gql } from '@apollo/client'


export const CREATE_POST = gql`
    mutation createPost($post: CreatePostInput) {
        createPost(post: $post) {
            _id
            title
            photoURL
            videoURL
            user {
                _id
                firstName
                lastName
                avatarURL
            }
            createdAt
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