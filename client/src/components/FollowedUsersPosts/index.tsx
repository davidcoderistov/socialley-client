import React, { useState, useMemo } from 'react'
import { useLoggedInUser } from '../../hooks/misc'
import { useQuery, useLazyQuery, useMutation, useApolloClient } from '@apollo/client'
import {
    GET_FOLLOWED_USERS_POSTS_PAGINATED,
    GET_USERS_WHO_LIKED_POST,
    GET_FIRST_LIKING_USER_FOR_POST,
    GET_COMMENTS_FOR_POST,
} from '../../graphql/queries/posts'
import {
    FollowedUsersPostsQueryData,
    UsersWhoLikedPostQueryData,
    FirstLikingUserForPostQueryData,
    CommentsForPostQueryData,
} from '../../graphql/types'
import { FollowedUserPost } from '../../types'
import Box, { BoxProps } from '@mui/material/Box'
import Post from '../Post'
import PostView from '../PostView/PostView'
import AllCaughtUp from './AllCaughtUp'
import {
    LIKE_POST,
    UNLIKE_POST,
    MARK_USER_POST_AS_FAVORITE,
    UNMARK_USER_POST_AS_FAVORITE
} from '../../graphql/mutations/posts'
import {
    updateFollowedUserPostLikedStatus,
    updateFollowedUserPostLikedLoadingStatus,
    updateFollowedUserPostFavoriteStatus,
    updateFollowedUserPostFavoriteLoadingStatus,
} from '../../apollo/mutations/posts/followedUsersPosts'
import {
    addLikingUser,
    removeLikingUser,
} from '../../apollo/mutations/posts/usersWhoLikedPost'
import { useSnackbar } from 'notistack'


export default function FollowedUsersPosts (props: BoxProps) {

    const [loggedInUser] = useLoggedInUser()

    const client = useApolloClient()

    const { enqueueSnackbar } = useSnackbar()

    const [viewingPostId, setViewingPostId] = useState<string | null>(null)

    const { data, loading, updateQuery } = useQuery<FollowedUsersPostsQueryData>(GET_FOLLOWED_USERS_POSTS_PAGINATED, {
        variables: {
            offset: 0,
            limit: 10,
        }
    })

    const [getFirstLikingUser] = useLazyQuery<FirstLikingUserForPostQueryData>(GET_FIRST_LIKING_USER_FOR_POST)

    const commentsForPost = useQuery<CommentsForPostQueryData>(GET_COMMENTS_FOR_POST, {
        variables: {
            postId: viewingPostId,
            offset: 0,
            limit: 10,
        },
        skip: !viewingPostId
    })

    const [likePost] = useMutation(LIKE_POST)
    const [unlikePost] = useMutation(UNLIKE_POST)

    const updateQueryFollowedUserPostLikedLoadingStatus = (postId: string, isLikedLoading: boolean) =>
        updateQuery(followedUsersPosts => updateFollowedUserPostLikedLoadingStatus({
            followedUsersPosts,
            postId,
            isLikedLoading,
        }).followedUsersPosts)

    const updateQueryFollowedUserPostLikedStatus = (postId: string, liked: boolean, firstLikeUser: { _id: string, username: string } | null) =>
        updateQuery(followedUsersPosts => updateFollowedUserPostLikedStatus({
            followedUsersPosts,
            postId,
            liked,
            firstLikeUser,
        }).followedUsersPosts)

    const handleLikePost = (postId: string, liked: boolean) => {
        updateQueryFollowedUserPostLikedLoadingStatus(postId, true)
        if (liked) {
            likePost({
                variables: {
                    postId
                }
            }).then(() => {
                updateQueryAddLikingUser(postId)
                updateQueryFollowedUserPostLikedStatus(postId, liked, loggedInUser)
            }).catch(() => {
                updateQueryFollowedUserPostLikedLoadingStatus(postId, false)
                enqueueSnackbar(`Could not like this post`, { variant: 'error' })
            })
        } else {
            unlikePost({
                variables: {
                    postId
                }
            }).then(() => {
                const usersWhoLikedPost = updateQueryRemoveLikingUser(postId)
                if (usersWhoLikedPost) {
                    updateQueryFollowedUserPostLikedStatus(
                        postId,
                        liked,
                        usersWhoLikedPost.getUsersWhoLikedPost.data.length > 0 ?
                            usersWhoLikedPost.getUsersWhoLikedPost.data[0] : null
                    )
                } else {
                    const post = data?.getFollowedUsersPostsPaginated.data.find(post => post._id === postId)
                    if (post) {
                        if (post.likesCount > 1) {
                            return getFirstLikingUser({ variables: { postId }}).then(({ data }) => {
                                const firstLikingUser = data?.getFirstLikingUserForPost ?? null
                                updateQueryFollowedUserPostLikedStatus(postId, liked, firstLikingUser)
                            }).catch(() => {
                                updateQueryFollowedUserPostLikedStatus(postId, liked, null)
                            })
                        }
                    }
                    updateQueryFollowedUserPostLikedStatus(postId, liked, null)
                }
            }).catch(() => {
                updateQueryFollowedUserPostLikedLoadingStatus(postId, false)
                enqueueSnackbar(`Could not unlike this post`, { variant: 'error' })
            })
        }
    }

    const [markPostAsFavorite] = useMutation(MARK_USER_POST_AS_FAVORITE)
    const [unmarkPostAsFavorite] = useMutation(UNMARK_USER_POST_AS_FAVORITE)

    const updateQueryFollowedUserPostFavoriteLoadingStatus = (postId: string, isFavoriteLoading: boolean) =>
        updateQuery(followedUsersPosts => updateFollowedUserPostFavoriteLoadingStatus({
            followedUsersPosts,
            postId,
            isFavoriteLoading,
        }).followedUsersPosts)

    const updateQueryFollowedUserPostFavoriteStatus = (postId: string, favorite: boolean) =>
        updateQuery(followedUsersPosts => updateFollowedUserPostFavoriteStatus({
            followedUsersPosts,
            postId,
            favorite,
        }).followedUsersPosts)

    const handleBookmarkPost = (postId: string, favorite: boolean) => {
        updateQueryFollowedUserPostFavoriteLoadingStatus(postId, true)
        if (favorite) {
            markPostAsFavorite({
                variables: {
                    postId
                }
            }).then(() => {
                updateQueryFollowedUserPostFavoriteStatus(postId, favorite)
            }).catch(() => {
                updateQueryFollowedUserPostFavoriteLoadingStatus(postId, false)
                enqueueSnackbar(`Could not mark this post as favorite`, { variant: 'error' })
            })
        } else {
            unmarkPostAsFavorite({
                variables: {
                    postId
                }
            }).then(() => {
                updateQueryFollowedUserPostFavoriteStatus(postId, favorite)
            }).catch(() => {
                updateQueryFollowedUserPostFavoriteLoadingStatus(postId, false)
                enqueueSnackbar(`Could not unmark this post as favorite`, { variant: 'error' })
            })
        }
    }

    const updateQueryAddLikingUser = (postId: string) => {
        client.cache.updateQuery({
            query: GET_USERS_WHO_LIKED_POST,
            variables: { postId }
        }, (usersWhoLikedPost: UsersWhoLikedPostQueryData | null) => {
            if (usersWhoLikedPost) {
                return addLikingUser({
                    usersWhoLikedPost,
                    likingUser: {
                        ...loggedInUser,
                        following: true,
                        isFollowingLoading: false,
                    }
                }).usersWhoLikedPost
            }
        })
    }

    const updateQueryRemoveLikingUser = (postId: string): UsersWhoLikedPostQueryData | null => {
        let usersWhoLikedPostResult = null
        client.cache.updateQuery({
            query: GET_USERS_WHO_LIKED_POST,
            variables: { postId }
        }, (usersWhoLikedPost: UsersWhoLikedPostQueryData | null) => {
            if (usersWhoLikedPost) {
                usersWhoLikedPostResult = usersWhoLikedPost
                const result = removeLikingUser({
                    usersWhoLikedPost,
                    userId: loggedInUser._id
                })
                if (result.success) {
                    usersWhoLikedPostResult = result.usersWhoLikedPost
                    return result.usersWhoLikedPost
                }
            }
        })
        return usersWhoLikedPostResult
    }

    const handleViewPost = (postId: string) => {
        setViewingPostId(postId)
    }

    const handleCloseViewPost = () => {
        setViewingPostId(null)
    }

    const viewingPost: FollowedUserPost | null = useMemo(() => {
        return data?.getFollowedUsersPostsPaginated.data.find(post => post._id === viewingPostId) ?? null
    }, [data, viewingPostId])

    return (
        <Box {...props}>
            { loading ? (
                <Post loading={true} />
            ) : (
                <>
                    { data && data.getFollowedUsersPostsPaginated.data.map(post => (
                        <Post
                            key={post._id}
                            post={post}
                            onClickUser={() => {}}
                            onFollowUser={() => {}}
                            onLikePost={handleLikePost}
                            onViewPost={handleViewPost}
                            onBookmarkPost={handleBookmarkPost}
                            onViewComments={handleViewPost} />
                    ))}
                    <AllCaughtUp />
                </>
            )}
            { viewingPost && (
                <PostView
                    postDetails={viewingPost}
                    isPostDetailsLoading={false}
                    onClickUser={() => {}}
                    onFollowUser={() => {}}
                    onLikePost={handleLikePost}
                    onViewPost={() => {}}
                    onBookmarkPost={handleBookmarkPost}
                    comments={commentsForPost.data?.getCommentsForPost.data ?? []}
                    commentsLoading={commentsForPost.loading}
                    onLikeComment={() => {}}
                    onClose={handleCloseViewPost} />
            )}
        </Box>
    )
}