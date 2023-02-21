import React, { useState, useMemo } from 'react'
import { useLoggedInUser } from '../../hooks/misc'
import { useQuery, useLazyQuery, useMutation, useApolloClient } from '@apollo/client'
import {
    GET_FOLLOWED_USERS_POSTS_PAGINATED,
    GET_USERS_WHO_LIKED_POST,
    GET_FIRST_LIKING_USER_FOR_POST,
    GET_COMMENTS_FOR_POST,
    GET_USERS_WHO_LIKED_COMMENT,
} from '../../graphql/queries/posts'
import {
    FollowedUsersPostsQueryData,
    UsersWhoLikedPostQueryData,
    FirstLikingUserForPostQueryData,
    CommentsForPostQueryData,
    UsersWhoLikedCommentQueryData,
    CreateCommentMutationData,
} from '../../graphql/types'
import { Comment } from '../../types'
import { FollowedUserPost } from '../../types'
import Box, { BoxProps } from '@mui/material/Box'
import Post from '../Post'
import PostView from '../PostView/PostView'
import AllCaughtUp from './AllCaughtUp'
import {
    LIKE_POST,
    UNLIKE_POST,
    MARK_USER_POST_AS_FAVORITE,
    UNMARK_USER_POST_AS_FAVORITE,
    CREATE_COMMENT,
    LIKE_COMMENT,
    UNLIKE_COMMENT,
} from '../../graphql/mutations/posts'
import {
    updateFollowedUserPostLikedStatus,
    updateFollowedUserPostLikedLoadingStatus,
    updateFollowedUserPostFavoriteStatus,
    updateFollowedUserPostFavoriteLoadingStatus,
    incrementFollowedUserPostCommentsCount,
} from '../../apollo/mutations/posts/followedUsersPosts'
import {
    updateCommentLikedStatus,
    updateCommentLikedLoadingStatus,
    addCommentForPost,
} from '../../apollo/mutations/posts/commentsForPost'
import usersWhoLikedPostMutations from '../../apollo/mutations/posts/usersWhoLikedPost'
import usersWhoLikedCommentMutations from '../../apollo/mutations/posts/usersWhoLikedComment'
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
        skip: !viewingPostId,
        notifyOnNetworkStatusChange: true,
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
                updatePostQueryAddLikingUser(postId)
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
                const usersWhoLikedPost = updatePostQueryRemoveLikingUser(postId)
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

    const updatePostQueryAddLikingUser = (postId: string) => {
        client.cache.updateQuery({
            query: GET_USERS_WHO_LIKED_POST,
            variables: { postId }
        }, (usersWhoLikedPost: UsersWhoLikedPostQueryData | null) => {
            if (usersWhoLikedPost) {
                return usersWhoLikedPostMutations.addLikingUser({
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

    const updatePostQueryRemoveLikingUser = (postId: string): UsersWhoLikedPostQueryData | null => {
        let usersWhoLikedPostResult = null
        client.cache.updateQuery({
            query: GET_USERS_WHO_LIKED_POST,
            variables: { postId }
        }, (usersWhoLikedPost: UsersWhoLikedPostQueryData | null) => {
            if (usersWhoLikedPost) {
                usersWhoLikedPostResult = usersWhoLikedPost
                const result = usersWhoLikedPostMutations.removeLikingUser({
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

    const [likeComment] = useMutation(LIKE_COMMENT)
    const [unlikeComment] = useMutation(UNLIKE_COMMENT)

    const updateQueryCommentLikedLoadingStatus = (commentId: string, postId: string, isLikedLoading: boolean) => {
        client.cache.updateQuery({
            query: GET_COMMENTS_FOR_POST,
            variables: { postId }
        }, (commentsForPost: CommentsForPostQueryData | null) => {
            if (commentsForPost) {
                return updateCommentLikedLoadingStatus({
                    commentsForPost,
                    commentId,
                    isLikedLoading,
                }).commentsForPost
            }
        })
    }

    const updateQueryCommentLikedStatus = (commentId: string, postId: string, liked: boolean) => {
        client.cache.updateQuery({
            query: GET_COMMENTS_FOR_POST,
            variables: { postId }
        }, (commentsForPost: CommentsForPostQueryData | null) => {
            if (commentsForPost) {
                return updateCommentLikedStatus({
                    commentsForPost,
                    commentId,
                    liked,
                }).commentsForPost
            }
        })
    }

    const updateCommentQueryAddLikingUser = (commentId: string) => {
        client.cache.updateQuery({
            query: GET_USERS_WHO_LIKED_COMMENT,
            variables: { commentId }
        }, (usersWhoLikedComment: UsersWhoLikedCommentQueryData | null) => {
            if (usersWhoLikedComment) {
                return usersWhoLikedCommentMutations.addLikingUser({
                    usersWhoLikedComment,
                    likingUser: {
                        ...loggedInUser,
                        following: true,
                        isFollowingLoading: false,
                    }
                }).usersWhoLikedComment
            }
        })
    }

    const updateCommentQueryRemoveLikingUser = (commentId: string) => {
        client.cache.updateQuery({
            query: GET_USERS_WHO_LIKED_COMMENT,
            variables: { commentId }
        }, (usersWhoLikedComment: UsersWhoLikedCommentQueryData | null) => {
            if (usersWhoLikedComment) {
                return usersWhoLikedCommentMutations.removeLikingUser({
                    usersWhoLikedComment,
                    userId: loggedInUser._id
                }).usersWhoLikedComment
            }
        })
    }

    const handleLikeComment = (commentId: string, postId: string, liked: boolean) => {
        updateQueryCommentLikedLoadingStatus(commentId, postId, true)
        if (liked) {
            likeComment({
                variables: { commentId }
            }).then(() => {
                updateCommentQueryAddLikingUser(commentId)
                updateQueryCommentLikedStatus(commentId, postId, liked)
            }).catch(() => {
                updateQueryCommentLikedLoadingStatus(commentId, postId, false)
                enqueueSnackbar(`Could not like this comment`, { variant: 'error' })
            })
        } else {
            unlikeComment({
                variables: { commentId }
            }).then(() => {
                updateCommentQueryRemoveLikingUser(commentId)
                updateQueryCommentLikedStatus(commentId, postId, liked)
            }).catch(() => {
                updateQueryCommentLikedLoadingStatus(commentId, postId, false)
                enqueueSnackbar(`Could not unlike this comment`, { variant: 'error' })
            })
        }
    }

    const [createComment, createCommentData] = useMutation<CreateCommentMutationData>(CREATE_COMMENT)

    const updateCommentsForPostAddComment = (postId: string, comment: Comment) => {
        client.cache.updateQuery({
            query: GET_COMMENTS_FOR_POST,
            variables: { postId }
        }, (commentsForPost: CommentsForPostQueryData | null) => {
            if (commentsForPost) {
                return addCommentForPost({
                    commentsForPost,
                    comment,
                }).commentsForPost
            }
        })
    }

    const handlePostComment = (comment: string) => {
        const postId = viewingPostId as string
        createComment({
            variables: {
                comment: {
                    postId,
                    text: comment,
                }
            }
        }).then(data => {
            const createComment = data.data?.createComment
            if (createComment) {
                updateCommentsForPostAddComment(
                    postId,
                    {
                        ...createComment,
                        user: {...loggedInUser},
                        liked: false,
                        isLikedLoading: false,
                        likesCount: 0,
                    }
                )
                updateQuery(followedUsersPosts => incrementFollowedUserPostCommentsCount({
                    followedUsersPosts,
                    postId,
                }).followedUsersPosts)
            } else {
                enqueueSnackbar(`Comment could not be posted`, { variant: 'error' })
            }
        }).catch(() => {
            enqueueSnackbar(`Comment could not be posted`, { variant: 'error' })
        })
    }

    const handleFetchMoreComments = () => {
        const postId = viewingPostId as string
        const commentsForPostData = commentsForPost.data as CommentsForPostQueryData
        commentsForPost.fetchMore({
            variables: { postId, offset: commentsForPostData.getCommentsForPost.data.length },
            updateQuery (existing, { fetchMoreResult }: { fetchMoreResult: CommentsForPostQueryData }) {
                return {
                    ...existing,
                    getCommentsForPost: {
                        ...existing.getCommentsForPost,
                        data: [
                            ...existing.getCommentsForPost.data,
                            ...fetchMoreResult.getCommentsForPost.data,
                        ]
                    }
                }
            }
        }).catch(console.log)
    }

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
                    onBookmarkPost={handleBookmarkPost}
                    comments={commentsForPost.data?.getCommentsForPost.data ?? []}
                    hasMoreComments={commentsForPost.data ? commentsForPost.data.getCommentsForPost.data.length < commentsForPost.data.getCommentsForPost.total : false}
                    commentsLoading={commentsForPost.loading}
                    onFetchMoreComments={handleFetchMoreComments}
                    onLikeComment={handleLikeComment}
                    isCommentPosting={createCommentData.loading}
                    onPostComment={handlePostComment}
                    onClose={handleCloseViewPost} />
            )}
        </Box>
    )
}