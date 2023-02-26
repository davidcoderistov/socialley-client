import { gql } from '@apollo/client'
import { FollowableUser, User } from '../../types/user'


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

export interface UserWhoLikedPost {
    followableUser: FollowableUser
    isFollowingLoading: boolean
}

export interface GetUsersWhoLikedPostQueryType {
    getUsersWhoLikedPost: {
        data: UserWhoLikedPost[]
        total: number
    }
}

export const GET_USERS_WHO_LIKED_POST = gql`
    query getUsersWhoLikedPost ($postId: String!, $offset: Int!, $limit: Int!) {
        getUsersWhoLikedPost (postId: $postId, offset: $offset, limit: $limit) {
            data {
                followableUser {
                    user {
                        _id
                        username
                        firstName
                        lastName
                        avatarURL
                    }
                    following
                }
                isFollowingLoading @client
            }
            total
        }
    }
`

export interface GetFirstUserWhoLikedPost {
    getFirstUserWhoLikedPost: User | null
}

export const GET_FIRST_USER_WHO_LIKED_POST = gql`
   query getFirstUserWhoLikedPost ($postId: String!) {
       getFirstUserWhoLikedPost (postId: $postId) {
           _id
           username
       }
   }
`

export interface Comment {
    _id: string
    text: string
    postId: string
    user: User
    liked: boolean
    isLikedLoading: boolean
    likesCount: number
    createdAt: number
}

export interface GetCommentsForPostQueryType {
    getCommentsForPost: {
        data: Comment[]
        total: number
    }
}

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

export interface UserWhoLikedComment {
    followableUser: FollowableUser
    isFollowingLoading: boolean
}

export interface GetUsersWhoLikedCommentQueryType {
    getUsersWhoLikedComment: {
        data: UserWhoLikedComment[]
        total: number
    }
}

export const GET_USERS_WHO_LIKED_COMMENT = gql`
    query getUsersWhoLikedComment ($commentId: String!, $offset: Int!, $limit: Int!) {
        getUsersWhoLikedComment (commentId: $commentId, offset: $offset, limit: $limit) {
            data {
                followableUser {
                    user {
                        _id
                        username
                        firstName
                        lastName
                        avatarURL
                    }
                    following
                }
                isFollowingLoading @client
            }
            total
        }
    }
`