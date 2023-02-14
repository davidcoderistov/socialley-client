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
                likesCount
                commentsCount
                createdAt
            }
            total
        }
    }
`