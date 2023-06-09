import React, { useState, useEffect, useMemo } from 'react'
import { useLoggedInUser } from '../../hooks/misc'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useFollowUser, useUnfollowUser } from '../../hooks/graphql/users'
import { useInfiniteScroll, useFetchMore } from '../../hooks/misc'
import {
    useLikeComment,
    useUnlikeComment,
    useUpdatePostAddLikingUser,
    useUpdatePostRemoveLikingUser,
    useComments,
    useCreateComment,
    useAddLikedPostForUser,
    useRemoveLikedPostForUser,
    useAddFavoritePostForUser,
    useRemoveFavoritePostForUser,
} from '../../hooks/graphql/posts'
import {
    updateFollowedUserPostsFollowingLoadingStatus,
    updateFollowedUserPostsFollowingStatus,
} from '../../apollo/mutations/posts/followedUsersPosts'
import {
    GET_FOLLOWED_USERS_POSTS,
    GET_FIRST_USER_WHO_LIKED_POST,
} from '../../graphql/queries/posts'
import {
    GetFollowedUsersPostsQueryType,
    GetFirstUserWhoLikedPostQueryType,
} from '../../graphql/types/queries/posts'
import { FollowedUserPost } from '../../graphql/types/models'
import Box, { BoxProps } from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Post from '../Post'
import PostView from '../PostView/PostView'
import PostSettingsModal from '../PostSettingsModal'
import AllCaughtUp from './AllCaughtUp'
import {
    LIKE_POST,
    UNLIKE_POST,
    MARK_USER_POST_AS_FAVORITE,
    UNMARK_USER_POST_AS_FAVORITE,
} from '../../graphql/mutations/posts'
import {
    updateFollowedUserPostLikedStatus,
    updateFollowedUserPostLikedLoadingStatus,
    updateFollowedUserPostFavoriteStatus,
    updateFollowedUserPostFavoriteLoadingStatus,
    incrementFollowedUserPostCommentsCount,
} from '../../apollo/mutations/posts/followedUsersPosts'
import { useSnackbar } from 'notistack'


export default function FollowedUsersPosts (props: BoxProps) {

    const [loggedInUser] = useLoggedInUser()

    const { enqueueSnackbar } = useSnackbar()

    const [viewingPostId, setViewingPostId] = useState<string | null>(null)
    const [isFollowedUsersPostsInitialLoading, setIsFollowedUsersPostsInitialLoading] = useState(true)

    const [getFollowedUsersPosts, followedUsersPosts] = useLazyQuery<GetFollowedUsersPostsQueryType>(GET_FOLLOWED_USERS_POSTS, {
        notifyOnNetworkStatusChange: true,
    })

    const fetchMoreFollowedUsersPosts = useFetchMore<GetFollowedUsersPostsQueryType>({
        queryName: 'getFollowedUsersPosts',
        queryResult: followedUsersPosts,
        updateQuery (existing, incoming) {
            return {
                ...existing,
                getFollowedUsersPosts: {
                    ...existing.getFollowedUsersPosts,
                    data: [
                        ...existing.getFollowedUsersPosts.data,
                        ...incoming.getFollowedUsersPosts.data,
                    ]
                }
            }
        }
    })

    const hasMoreFollowedUsersPosts = useMemo(() => {
        if (!followedUsersPosts.error) {
            if (followedUsersPosts.data) {
                return followedUsersPosts.data.getFollowedUsersPosts.data.length < followedUsersPosts.data.getFollowedUsersPosts.total
            }
        }
        return false
    }, [followedUsersPosts])

    const handleFetchMoreFollowedUsersPosts = () => {
        if (!followedUsersPosts.loading && followedUsersPosts.data) {
            fetchMoreFollowedUsersPosts({
                variables: {
                    offset: followedUsersPosts.data.getFollowedUsersPosts.data.length,
                    limit: 4,
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
        }).finally(() => {
            setIsFollowedUsersPostsInitialLoading(false)
        })
    }, [])

    const [isPostSettingsModalOpen, setIsPostSettingsModalOpen] = useState(false)
    const [postSettingsModalShowUnfollow, setSettingsModalShowUnfollow] = useState(false)
    const [postSettingsModalIsFollowingLoading, setPostSettingsModalIsFollowingLoading] = useState(false)
    const [postSettingsModalPostId, setPostSettingsModalPostId] = useState<string | null>(null)
    const [postSettingsModalUserId, setPostSettingsModalUserId] = useState<string | null>(null)

    const handleClickMore = (postId: string, userId: string) => {
        setIsPostSettingsModalOpen(true)
        setPostSettingsModalPostId(postId)
        setPostSettingsModalUserId(userId)
        const post = followedUsersPosts.data?.getFollowedUsersPosts.data.find(
            followedUserPost => followedUserPost.postDetails.post._id === postId
        )
        if (post) {
            setSettingsModalShowUnfollow(post.postDetails.followableUser.following)
        }
    }

    const followUser = useFollowUser()
    const unfollowUser = useUnfollowUser()

    const updateFollowingLoadingStatus = (userId: string, isFollowingLoading: boolean) => {
        followedUsersPosts.updateQuery(followedUsersPosts => updateFollowedUserPostsFollowingLoadingStatus({
            followedUsersPosts,
            userId,
            isFollowingLoading,
        }).followedUsersPosts)
    }

    const updateFollowingStatus = (userId: string, following: boolean) => {
        followedUsersPosts.updateQuery(followedUsersPosts => updateFollowedUserPostsFollowingStatus({
            followedUsersPosts,
            userId,
            following,
        }).followedUsersPosts)
    }

    const handleFollowUser = (userId: string) => {
        followUser(userId, {
            onStart () {
                updateFollowingLoadingStatus(userId, true)
            },
            onSuccess () {
                updateFollowingStatus(userId, true)
            },
            onError () {
                updateFollowingLoadingStatus(userId, false)
            }
        })
    }

    const handleUnfollowUser = () => {
        const userId = postSettingsModalUserId as string
        unfollowUser(userId, {
            onStart () {
                setPostSettingsModalIsFollowingLoading(true)
            },
            onSuccess () {
                updateFollowingStatus(userId, false)
                handleClosePostSettingsModal()
            },
            onError () {
                handleClosePostSettingsModal()
            }
        })
    }

    const handleGoToPost = () => {
        setViewingPostId(postSettingsModalPostId)
        handleClosePostSettingsModal()
    }

    const handleClosePostSettingsModal = () => {
        setIsPostSettingsModalOpen(false)
        setPostSettingsModalPostId(null)
        setPostSettingsModalUserId(null)
        setPostSettingsModalIsFollowingLoading(false)
    }

    const addLikedPostForUser = useAddLikedPostForUser()
    const removeLikedPostForUser = useRemoveLikedPostForUser()
    const addFavoritePostForUser = useAddFavoritePostForUser()
    const removeFavoritePostForUser = useRemoveFavoritePostForUser()

    const [getFirstLikingUser] = useLazyQuery<GetFirstUserWhoLikedPostQueryType>(GET_FIRST_USER_WHO_LIKED_POST)

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
                const followedUserPost = followedUsersPosts.data?.getFollowedUsersPosts.data.find(followedUserPost => followedUserPost.postDetails.post._id === postId)
                if (followedUserPost) {
                    addLikedPostForUser(followedUserPost.postDetails.post)
                }
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
                removeLikedPostForUser(postId)
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
                const followedUserPost = followedUsersPosts.data?.getFollowedUsersPosts.data.find(followedUserPost => followedUserPost.postDetails.post._id === postId)
                if (followedUserPost) {
                    addFavoritePostForUser(followedUserPost.postDetails.post)
                }
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
                removeFavoritePostForUser(postId)
            }).catch(() => {
                updateQueryFollowedUserPostFavoriteLoadingStatus(postId, false)
                enqueueSnackbar(`Could not unmark this post as favorite`, { variant: 'error' })
            })
        }
    }

    const updatePostQueryAddLikingUser = useUpdatePostAddLikingUser()

    const updatePostQueryRemoveLikingUser = useUpdatePostRemoveLikingUser()

    const handleViewPost = (postId: string) => {
        setViewingPostId(postId)
    }

    const handleCloseViewPost = () => {
        setViewingPostId(null)
    }

    const viewingPost: FollowedUserPost | null = useMemo(() => {
        return followedUsersPosts.data?.getFollowedUsersPosts.data.find(followedUserPost => followedUserPost.postDetails.post._id === viewingPostId) ?? null
    }, [followedUsersPosts.data, viewingPostId])

    const { commentsForPost, fetchMoreComments, hasMoreComments } = useComments({ postId: viewingPostId })

    const likeComment = useLikeComment()
    const unlikeComment = useUnlikeComment()

    const handleLikeComment = (commentId: string, postId: string, liked: boolean) => {
        if (liked) {
            likeComment(commentId, postId)
        } else {
            unlikeComment(commentId, postId)
        }
    }

    const { createComment, createCommentData } = useCreateComment({ postId: viewingPostId })

    const handlePostComment = (comment: string) => {
        createComment(
            comment,
            () => {
                followedUsersPosts.updateQuery(followedUsersPosts => incrementFollowedUserPostCommentsCount({
                    followedUsersPosts,
                    postId: viewingPostId as string,
                }).followedUsersPosts)
            }
        )
    }

    return (
        <Box {...props}>
            { isFollowedUsersPostsInitialLoading ? (
                <Post loading={true} />
            ) : (
                <>
                    { followedUsersPosts.data && followedUsersPosts.data.getFollowedUsersPosts.data.map(followedUserPost => (
                        <Post
                            key={followedUserPost.postDetails.post._id}
                            post={{
                                ...followedUserPost,
                                ...followedUserPost.postDetails,
                                user: {
                                    ...followedUserPost.postDetails.followableUser.user,
                                    following: followedUserPost.postDetails.followableUser.following,
                                    isFollowingLoading: followedUserPost.postDetails.isFollowingLoading
                                },
                                ...followedUserPost.postDetails.post
                            }}
                            onClickUser={() => {}}
                            onFollowUser={handleFollowUser}
                            onClickMore={handleClickMore}
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
                    postDetails={{
                        ...viewingPost,
                        ...viewingPost.postDetails,
                        ...viewingPost.postDetails.post,
                        user: {
                            ...viewingPost.postDetails.followableUser.user,
                            following: viewingPost.postDetails.followableUser.following,
                            isFollowingLoading: viewingPost.postDetails.isFollowingLoading
                        }
                    }}
                    isPostDetailsLoading={false}
                    onClickUser={handleCloseViewPost}
                    onFollowUser={handleFollowUser}
                    onClickMore={handleClickMore}
                    onLikePost={handleLikePost}
                    onBookmarkPost={handleBookmarkPost}
                    comments={commentsForPost.data?.getCommentsForPost.data ?? []}
                    hasMoreComments={hasMoreComments}
                    commentsLoading={commentsForPost.loading}
                    onFetchMoreComments={fetchMoreComments}
                    onLikeComment={handleLikeComment}
                    isCommentPosting={createCommentData.loading}
                    onPostComment={handlePostComment}
                    onClose={handleCloseViewPost} />
            )}
            <PostSettingsModal
                open={isPostSettingsModalOpen}
                showUnfollow={postSettingsModalShowUnfollow}
                isFollowingLoading={postSettingsModalIsFollowingLoading}
                onUnfollow={handleUnfollowUser}
                onGoToPost={handleGoToPost}
                onCloseModal={handleClosePostSettingsModal} />
        </Box>
    )
}