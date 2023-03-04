import React, { useState, useEffect, useMemo } from 'react'
import { useLoggedInUser } from '../../hooks/misc'
import { useQuery, useLazyQuery, useMutation, useApolloClient } from '@apollo/client'
import { useInfiniteScroll } from '../../hooks/misc'
import {
    useLikeComment,
    useUnlikeComment,
    useUpdatePostAddLikingUser,
} from '../../hooks/graphql/posts'
import {
    GET_FOLLOWED_USERS_POSTS,
    GET_USERS_WHO_LIKED_POST,
    GET_FIRST_USER_WHO_LIKED_POST,
    GET_COMMENTS_FOR_POST,
} from '../../graphql/queries/posts'
import {
    GetFollowedUsersPostsQueryType,
    GetUsersWhoLikedPostQueryType,
    GetFirstUserWhoLikedPostQueryType,
    GetCommentsForPostQueryType,
} from '../../graphql/types/queries/posts'
import { FollowedUserPost, Comment } from '../../graphql/types/models'
import { CreateCommentMutationType } from '../../graphql/types/mutations/posts'
import Box, { BoxProps } from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Post from '../Post'
import PostView from '../PostView/PostView'
import AllCaughtUp from './AllCaughtUp'
import {
    LIKE_POST,
    UNLIKE_POST,
    MARK_USER_POST_AS_FAVORITE,
    UNMARK_USER_POST_AS_FAVORITE,
    CREATE_COMMENT,
} from '../../graphql/mutations/posts'
import {
    updateFollowedUserPostLikedStatus,
    updateFollowedUserPostLikedLoadingStatus,
    updateFollowedUserPostFavoriteStatus,
    updateFollowedUserPostFavoriteLoadingStatus,
    incrementFollowedUserPostCommentsCount,
} from '../../apollo/mutations/posts/followedUsersPosts'
import {
    addCommentForPost,
} from '../../apollo/mutations/posts/commentsForPost'
import usersWhoLikedPostMutations from '../../apollo/mutations/posts/usersWhoLikedPost'
import { useSnackbar } from 'notistack'


export default function FollowedUsersPosts (props: BoxProps) {

    const [loggedInUser] = useLoggedInUser()

    const client = useApolloClient()

    const { enqueueSnackbar } = useSnackbar()

    const [viewingPostId, setViewingPostId] = useState<string | null>(null)
    const [isFollowedUsersPostsInitialLoading, setIsFollowedUsersPostsInitialLoading] = useState(true)

    const [getFollowedUsersPosts, followedUsersPosts] = useLazyQuery<GetFollowedUsersPostsQueryType>(GET_FOLLOWED_USERS_POSTS, {
        notifyOnNetworkStatusChange: true,
    })

    const hasMoreFollowedUsersPosts = useMemo(() => {
        if (!followedUsersPosts.error) {
            if (followedUsersPosts.data) {
                const data = followedUsersPosts.data.getFollowedUsersPosts.data
                const total = followedUsersPosts.data.getFollowedUsersPosts.total
                if (data.length > 0 && data.length < total) {
                    return true
                }
            }
        }
        return false
    }, [followedUsersPosts])

    const handleFetchMoreFollowedUsersPosts = () => {
        if (!followedUsersPosts.loading) {
            followedUsersPosts.fetchMore({
                variables: {
                    offset: followedUsersPosts.data?.getFollowedUsersPosts.data.length,
                    limit: 4,
                },
                updateQuery (existing, { fetchMoreResult }: { fetchMoreResult: GetFollowedUsersPostsQueryType }) {
                    return {
                        ...existing,
                        getFollowedUsersPosts: {
                            ...existing.getFollowedUsersPosts,
                            data: [
                                ...existing.getFollowedUsersPosts.data,
                                ...fetchMoreResult.getFollowedUsersPosts.data,
                            ]
                        }
                    }
                }
            })
        }
    }

    const infiniteScrollRef = useInfiniteScroll<HTMLDivElement>(handleFetchMoreFollowedUsersPosts)

    useEffect(() => {
        setIsFollowedUsersPostsInitialLoading(true)
        getFollowedUsersPosts({
            variables: {
                offset: 0,
                limit: 4,
            }
        }).finally(() => setIsFollowedUsersPostsInitialLoading(false))
    }, [])

    const [getFirstLikingUser] = useLazyQuery<GetFirstUserWhoLikedPostQueryType>(GET_FIRST_USER_WHO_LIKED_POST)

    const commentsForPost = useQuery<GetCommentsForPostQueryType>(GET_COMMENTS_FOR_POST, {
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
        followedUsersPosts.updateQuery(followedUsersPosts => updateFollowedUserPostLikedLoadingStatus({
            followedUsersPosts,
            postId,
            isLikedLoading,
        }).followedUsersPosts)

    const updateQueryFollowedUserPostLikedStatus = (postId: string, liked: boolean, firstLikeUser: { _id: string, username: string } | null) =>
        followedUsersPosts.updateQuery(followedUsersPosts => updateFollowedUserPostLikedStatus({
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
                            usersWhoLikedPost.getUsersWhoLikedPost.data[0].followableUser.user : null
                    )
                } else {
                    const followedUserPost = followedUsersPosts.data?.getFollowedUsersPosts.data.find(followedUserPost => followedUserPost.postDetails.post._id === postId)
                    if (followedUserPost) {
                        if (followedUserPost.postDetails.likesCount > 1) {
                            return getFirstLikingUser({ variables: { postId }}).then(({ data }) => {
                                const firstLikingUser = data?.getFirstUserWhoLikedPost ?? null
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
        followedUsersPosts.updateQuery(followedUsersPosts => updateFollowedUserPostFavoriteLoadingStatus({
            followedUsersPosts,
            postId,
            isFavoriteLoading,
        }).followedUsersPosts)

    const updateQueryFollowedUserPostFavoriteStatus = (postId: string, favorite: boolean) =>
        followedUsersPosts.updateQuery(followedUsersPosts => updateFollowedUserPostFavoriteStatus({
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

    const updatePostQueryAddLikingUser = useUpdatePostAddLikingUser()

    const updatePostQueryRemoveLikingUser = (postId: string): GetUsersWhoLikedPostQueryType | null => {
        let usersWhoLikedPostResult = null
        client.cache.updateQuery({
            query: GET_USERS_WHO_LIKED_POST,
            variables: { postId }
        }, (usersWhoLikedPost: GetUsersWhoLikedPostQueryType | null) => {
            if (usersWhoLikedPost) {
                usersWhoLikedPostResult = usersWhoLikedPost
                const result = usersWhoLikedPostMutations.removeUserWhoLikedPost({
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
        return followedUsersPosts.data?.getFollowedUsersPosts.data.find(followedUserPost => followedUserPost.postDetails.post._id === viewingPostId) ?? null
    }, [followedUsersPosts.data, viewingPostId])

    const likeComment = useLikeComment()
    const unlikeComment = useUnlikeComment()

    const handleLikeComment = (commentId: string, postId: string, liked: boolean) => {
        if (liked) {
            likeComment(commentId, postId)
        } else {
            unlikeComment(commentId, postId)
        }
    }

    const [createComment, createCommentData] = useMutation<CreateCommentMutationType>(CREATE_COMMENT)

    const updateCommentsForPostAddComment = (postId: string, comment: Comment) => {
        client.cache.updateQuery({
            query: GET_COMMENTS_FOR_POST,
            variables: { postId }
        }, (commentsForPost: GetCommentsForPostQueryType | null) => {
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
                if (!hasMoreComments) {
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
                }
                followedUsersPosts.updateQuery(followedUsersPosts => incrementFollowedUserPostCommentsCount({
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
        const commentsForPostData = commentsForPost.data as GetCommentsForPostQueryType
        commentsForPost.fetchMore({
            variables: { postId, offset: commentsForPostData.getCommentsForPost.data.length },
            updateQuery (existing, { fetchMoreResult }: { fetchMoreResult: GetCommentsForPostQueryType }) {
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

    const hasMoreComments = commentsForPost.data ?
        commentsForPost.data.getCommentsForPost.data.length < commentsForPost.data.getCommentsForPost.total : false

    return (
        <Box {...props}>
            { isFollowedUsersPostsInitialLoading ? (
                <Post loading={true} />
            ) : (
                <>
                    { followedUsersPosts.data && followedUsersPosts.data.getFollowedUsersPosts.data.map(followedUserPost => (
                        <Post
                            key={followedUserPost.postDetails.post._id}
                            post={{...followedUserPost, ...followedUserPost.postDetails, user: {...followedUserPost.postDetails.user, following: false, isFollowingLoading: false}, ...followedUserPost.postDetails.post}}
                            onClickUser={() => {}}
                            onFollowUser={() => {}}
                            onLikePost={handleLikePost}
                            onViewPost={handleViewPost}
                            onBookmarkPost={handleBookmarkPost}
                            onViewComments={handleViewPost} />
                    ))}
                    { hasMoreFollowedUsersPosts ? (
                        <Box
                            ref={infiniteScrollRef}
                            component='div'
                            display='flex'
                            flexDirection='row'
                            justifyContent='center'
                            alignItems='flex-start'
                            height='60px'
                        >
                            <CircularProgress size={30} sx={{ color: '#FFFFFF', mt: 1 }} />
                        </Box>
                    ) : (
                        <AllCaughtUp />
                    )}
                </>
            )}
            { viewingPost && (
                <PostView
                    postDetails={{...viewingPost, ...viewingPost.postDetails, ...viewingPost.postDetails.post, user: {...viewingPost.postDetails.user, following: false, isFollowingLoading: false}}}
                    isPostDetailsLoading={false}
                    onClickUser={() => {}}
                    onFollowUser={() => {}}
                    onLikePost={handleLikePost}
                    onBookmarkPost={handleBookmarkPost}
                    comments={commentsForPost.data?.getCommentsForPost.data ?? []}
                    hasMoreComments={hasMoreComments}
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