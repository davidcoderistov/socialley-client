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
                }
                firstLikeUser {
                    _id
                    username
                }
                liked
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