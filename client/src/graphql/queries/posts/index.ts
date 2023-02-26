import { gql } from '@apollo/client'
import { FollowableUser, User } from '../../types/user'


export interface FollowedUserPost {
    post: {
        _id: string
        title: string | null
        photoURL: string
        videoURL: string | null
        user: Omit<User, 'email'>
        firstLikeUser: Pick<User, '_id' | 'username'> | null
        liked: boolean
        isLikedLoading: boolean
        favorite: boolean
        isFavoriteLoading: boolean
        likesCount: number
        createdAt: number
    }
    commentsCount: number
}

export interface GetFollowedUsersPostsQueryType {
    getFollowedUsersPosts: {
        data: FollowedUserPost[]
        total: number
    }
}

export const GET_FOLLOWED_USERS_POSTS = gql`
    query getFollowedUsersPosts ($offset: Int!, $limit: Int!) {
        getFollowedUsersPosts (offset: $offset, limit: $limit) {
            data {
                post {
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
                    isLikedLoading @client
                    favorite
                    isFavoriteLoading @client
                    likesCount
                    createdAt
                }
                commentsCount
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