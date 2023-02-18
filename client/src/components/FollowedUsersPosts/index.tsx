import React from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_FOLLOWED_USERS_POSTS_PAGINATED } from '../../graphql/queries/posts'
import { FollowedUsersPostsQueryData } from '../../graphql/types'
import Box, { BoxProps } from '@mui/material/Box'
import Post from '../Post'
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
import { useSnackbar } from 'notistack'


export default function FollowedUsersPosts (props: BoxProps) {

    const { enqueueSnackbar } = useSnackbar()

    const { data, loading, fetchMore, updateQuery } = useQuery<FollowedUsersPostsQueryData>(GET_FOLLOWED_USERS_POSTS_PAGINATED, {
        variables: {
            offset: 0,
            limit: 10,
        }
    })

    const [likePost] = useMutation(LIKE_POST)
    const [unlikePost] = useMutation(UNLIKE_POST)

    const updateQueryFollowedUserPostLikedLoadingStatus = (postId: string, isLikedLoading: boolean) =>
        updateQuery(followedUsersPosts => updateFollowedUserPostLikedLoadingStatus({
            followedUsersPosts,
            postId,
            isLikedLoading,
        }).followedUsersPosts)

    const updateQueryFollowedUserPostLikedStatus = (postId: string, liked: boolean) =>
        updateQuery(followedUsersPosts => updateFollowedUserPostLikedStatus({
            followedUsersPosts,
            postId,
            liked,
        }).followedUsersPosts)

    const handleLikePost = (postId: string, liked: boolean) => {
        updateQueryFollowedUserPostLikedLoadingStatus(postId, true)
        if (liked) {
            likePost({
                variables: {
                    postId
                }
            }).then(() => {
                updateQueryFollowedUserPostLikedStatus(postId, liked)
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
                updateQueryFollowedUserPostLikedStatus(postId, liked)
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

    const handleViewPost = (postId: string) => {

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
        </Box>
    )
}