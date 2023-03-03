import { gql } from '@apollo/client'


export const GET_FOLLOWED_USERS_POSTS = gql`
    query getFollowedUsersPosts ($offset: Int!, $limit: Int!) {
        getFollowedUsersPosts (offset: $offset, limit: $limit) {
            data {
                postDetails {
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
                commentsCount
            }
            total
        }
    }
`

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

export const GET_FIRST_USER_WHO_LIKED_POST = gql`
   query getFirstUserWhoLikedPost ($postId: String!) {
       getFirstUserWhoLikedPost (postId: $postId) {
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

export const GET_POSTS_FOR_USER = gql`
    query getPostsForUser {
        getPostsForUser {
            _id
            photoURL
            videoURL
        }
    }
`

export const GET_LIKED_POSTS_FOR_USER = gql`
    query getLikedPostsForUser {
        getLikedPostsForUser {
            _id
            photoURL
            videoURL
        }
    }
`

export const GET_FAVORITE_POSTS_FOR_USER = gql`
    query getFavoritePostsForUser {
        getFavoritePostsForUser {
            _id
            photoURL
            videoURL
        }
    }
`

export const GET_POST_DETAILS = gql`
    query getPostDetails ($postId: String!) {
        getPostDetails (postId: $postId) {
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