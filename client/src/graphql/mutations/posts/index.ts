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