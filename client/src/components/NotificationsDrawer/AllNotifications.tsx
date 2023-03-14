import React, { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import {
    useFollowNotificationUser,
    useUnfollowNotificationUser,
} from '../../hooks/graphql/users'
import {
    GET_POST_LIKE_NOTIFICATIONS_FOR_USER,
    GET_POST_COMMENT_NOTIFICATIONS_FOR_USER
} from '../../graphql/queries/posts'
import { GET_FOLLOW_NOTIFICATIONS_FOR_USER } from '../../graphql/queries/users'
import {
    GetPostLikeNotificationsForUserQueryType,
    GetPostCommentNotificationsForUserQueryType
} from '../../graphql/types/queries/posts'
import { GetFollowNotificationsForUserQueryType } from '../../graphql/types/queries/users'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TopThreeNotifications from './TopThreeNotifications'
import Notification from '../Notification'
import _range from 'lodash/range'


interface AllNotificationsProps {
    shouldSkipQuery: boolean
    visible: boolean
    onClickPostLikeNotification: (postId: string) => void
    onClickPostCommentNotification: (postId: string) => void
    onClickPostFollowNotification: (userId: string) => void
    onClickSeeAllLikes: () => void
    onClickSeeAllComments: () => void
    onClickSeeAllFollowings: () => void
}

export default function AllNotifications (props: AllNotificationsProps) {

    const followUser = useFollowNotificationUser()
    const unfollowUser = useUnfollowNotificationUser()

    const postLikeNotifications = useQuery<GetPostLikeNotificationsForUserQueryType>(GET_POST_LIKE_NOTIFICATIONS_FOR_USER, {
        variables: {
            offset: 0,
            limit: 3,
        },
        skip: props.shouldSkipQuery,
    })

    const postCommentNotifications = useQuery<GetPostCommentNotificationsForUserQueryType>(GET_POST_COMMENT_NOTIFICATIONS_FOR_USER, {
        variables: {
            offset: 0,
            limit: 3,
        },
        skip: props.shouldSkipQuery,
    })

    const followNotifications = useQuery<GetFollowNotificationsForUserQueryType>(GET_FOLLOW_NOTIFICATIONS_FOR_USER, {
        variables: {
            offset: 0,
            limit: 3,
        },
        skip: props.shouldSkipQuery,
    })

    const likes = useMemo(() => {
        if (!postLikeNotifications.loading && !postLikeNotifications.error && postLikeNotifications.data) {
            return postLikeNotifications.data.getPostLikeNotificationsForUser.data.slice(0, 3)
        }
        return []
    }, [postLikeNotifications.loading, postLikeNotifications.error, postLikeNotifications.data])

    const likesTotal = useMemo(() => {
        if (!postLikeNotifications.loading && !postLikeNotifications.error && postLikeNotifications.data) {
            return postLikeNotifications.data.getPostLikeNotificationsForUser.total
        }
        return 0
    }, [postLikeNotifications.loading, postLikeNotifications.error, postLikeNotifications.data])

    const comments = useMemo(() => {
        if (!postCommentNotifications.loading && !postCommentNotifications.error && postCommentNotifications.data) {
            return postCommentNotifications.data.getPostCommentNotificationsForUser.data.slice(0, 3)
        }
        return []
    }, [postCommentNotifications.loading, postCommentNotifications.error, postCommentNotifications.data])

    const commentsTotal = useMemo(() => {
        if (!postCommentNotifications.loading && !postCommentNotifications.error && postCommentNotifications.data) {
            return postCommentNotifications.data.getPostCommentNotificationsForUser.total
        }
        return 0
    }, [postCommentNotifications.loading, postCommentNotifications.error, postCommentNotifications.data])

    const follows = useMemo(() => {
        if (!followNotifications.loading && !followNotifications.error && followNotifications.data) {
            return followNotifications.data.getFollowNotificationsForUser.data.slice(0, 3)
        }
        return []
    }, [followNotifications.loading, followNotifications.error, followNotifications.data])

    const followsTotal = useMemo(() => {
        if (!followNotifications.loading && !followNotifications.error && followNotifications.data) {
            return followNotifications.data.getFollowNotificationsForUser.total
        }
        return 0
    }, [followNotifications.loading, followNotifications.error, followNotifications.data])

    const handleFollowUser = (userId: string, event: React.MouseEvent) => {
        event.stopPropagation()
        followUser(userId)
    }

    const handleUnfollowUser = (userId: string) => {
        unfollowUser(userId)
    }

    return (
        <>
            <Box
                component='div'
                border='0'
                flexGrow='1'
                fontSize='100%'
                left='0'
                margin='0'
                position='absolute'
                width='100%'
                sx={{ overflowX: 'hidden', overflowY: 'auto', verticalAlign: 'baseline', ...!props.visible && { display: 'none'}}}
            >
                { postLikeNotifications.loading || postCommentNotifications.loading || followNotifications.loading ? (
                    <Box
                        component='div'
                        display='block'
                    >
                        { _range(12).map(index => (
                            <Notification
                                key={index}
                                isUserLoading={true} />
                        ))}
                    </Box>
                ): (likes.length > 0 || comments.length > 0 || follows.length > 0) ? (
                    <>
                        { likes.length > 0 && (
                            <TopThreeNotifications
                                title='Likes'
                                showSeeAll={!postLikeNotifications.loading && likesTotal > 3}
                                onClickSeeAll={props.onClickSeeAllLikes}
                            >
                                { postLikeNotifications.loading ? _range(3).map(index => (
                                    <Notification
                                        key={index}
                                        isUserLoading={true} />
                                )): likes.map(like => (
                                    <Box
                                        key={like._id}
                                        component='div'
                                        paddingRight='8px'
                                        sx={{ '&:hover': { backgroundColor: '#121212' }, cursor: 'pointer' }}
                                        onClick={() => props.onClickPostLikeNotification(like.post._id)}
                                    >
                                        <Notification
                                            key={like._id}
                                            type='post'
                                            user={like.user}
                                            photoURL={like.post.photoURL}
                                            createdAt={like.createdAt} />
                                    </Box>
                                ))}
                            </TopThreeNotifications>
                        )}
                        { comments.length > 0 && (
                            <TopThreeNotifications
                                title='Comments'
                                showSeeAll={!postCommentNotifications.loading && commentsTotal > 3}
                                onClickSeeAll={props.onClickSeeAllComments}
                            >
                                { postCommentNotifications.loading ? _range(3).map(index => (
                                    <Notification
                                        key={index}
                                        isUserLoading={true} />
                                )): comments.map(comment => (
                                    <Box
                                        key={comment._id}
                                        component='div'
                                        paddingRight='8px'
                                        sx={{ '&:hover': { backgroundColor: '#121212' }, cursor: 'pointer' }}
                                        onClick={() => props.onClickPostCommentNotification(comment.post._id)}
                                    >
                                        <Notification
                                            key={comment._id}
                                            type='comment'
                                            user={comment.user}
                                            photoURL={comment.post.photoURL}
                                            createdAt={comment.createdAt} />
                                    </Box>
                                ))}
                            </TopThreeNotifications>
                        )}
                        { follows.length > 0 && (
                            <TopThreeNotifications
                                title='Followings'
                                showSeeAll={!followNotifications.loading && followsTotal > 3}
                                onClickSeeAll={props.onClickSeeAllFollowings}
                            >
                                { followNotifications.loading ? _range(3).map(index => (
                                    <Notification
                                        key={index}
                                        isUserLoading={true} />
                                )): follows.map(follow => (
                                    <Box
                                        key={follow._id}
                                        component='div'
                                        paddingRight='8px'
                                        sx={{ '&:hover': { backgroundColor: '#121212' }, cursor: 'pointer' }}
                                        onClick={() => props.onClickPostFollowNotification(follow.followableUser.user._id)}
                                    >
                                        <Notification
                                            key={follow._id}
                                            type='follow'
                                            user={{...follow.followableUser, ...follow.followableUser.user, isFollowingLoading: follow.isFollowingLoading}}
                                            createdAt={follow.createdAt}
                                            onFollowUser={handleFollowUser}
                                            onUnfollowUser={handleUnfollowUser} />
                                    </Box>
                                ))}
                            </TopThreeNotifications>
                        )}
                    </>
                ): null}
            </Box>
            { props.visible && !postLikeNotifications.loading && likes.length === 0 &&
                !postCommentNotifications.loading && comments.length === 0 &&
                !followNotifications.loading && follows.length === 0 && (
                    <Box
                        component='div'
                        position='absolute'
                        top='50%'
                        display='flex'
                        flexDirection='column'
                        justifyContent='center'
                        alignItems='center'
                        width='100%'
                    >
                        <Typography
                            fontSize={14}
                            color='#A8A8A8'
                        >
                            No recent notifications.
                        </Typography>
                    </Box>
                )}
        </>
    )
}
