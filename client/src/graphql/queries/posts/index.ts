import { gql } from '@apollo/client'


export const GET_FOLLOWED_USERS_POSTS_PAGINATED = gql`
    query getFollowedUsersPostsPaginated ($offset: Int!, $limit: Int!) {
        getFollowedUsersPostsPaginated(offset: $offset, limit: $limit) {
            data {
                _id
                title
                photoURL
                videoURL
                user {
                    _id
                    firstName
                    lastName
                    username
                    avatarURL
                    following @client
                    isFollowingLoading @client
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
                commentsCount
                createdAt
            }
            total
        }
    }
`

export const GET_USERS_WHO_LIKED_POST = gql`
    query getUsersWhoLikedPost ($postId: String!, $offset: Int!, $limit: Int!) {
        getUsersWhoLikedPost (postId: $postId, offset: $offset, limit: $limit) {
            data {
                _id
                username
                firstName
                lastName
                avatarURL
                following
                isFollowingLoading @client
            }
            total
        }
    }
`

export const GET_FIRST_LIKING_USER_FOR_POST = gql`
   query getFirstLikingUserForPost($postId: String!) {
       getFirstLikingUserForPost(postId: $postId) {
           _id
           username
       }
   }
`

export const GET_COMMENTS_FOR_POST = gql`
    query getCommentsForPost($postId: String!, $offset: Int!, $limit: Int!) {
        getCommentsForPost(postId: $postId, offset: $offset, limit: $limit) {
            data {
                _id
                text
                postId
                user {
                    _id
                    firstName
                    lastName
                    username
                    avatarURL
                }
                liked
                isLikedLoading @client
                likesCount
                createdAt
            }
            total
        }
    }
`