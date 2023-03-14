import React, { useMemo } from 'react'
import { useInfiniteScroll } from '../../hooks/misc'
import { useQuery } from '@apollo/client'
import { GET_POST_COMMENT_NOTIFICATIONS_FOR_USER } from '../../graphql/queries/posts'
import { GetPostCommentNotificationsForUserQueryType } from '../../graphql/types/queries/posts'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Notification from '../Notification'


interface PostCommentNotificationsProps {
    visible: boolean
    onClick: (postId: string) => void
}

export default function PostCommentNotifications (props: PostCommentNotificationsProps) {

    const postCommentNotifications = useQuery<GetPostCommentNotificationsForUserQueryType>(GET_POST_COMMENT_NOTIFICATIONS_FOR_USER)

    const comments = useMemo(() => {
        if (!postCommentNotifications.loading && !postCommentNotifications.error && postCommentNotifications.data) {
            return postCommentNotifications.data.getPostCommentNotificationsForUser.data
        }
        return []
    }, [postCommentNotifications.loading, postCommentNotifications.error, postCommentNotifications.data])

    const commentsTotal = useMemo(() => {
        if (!postCommentNotifications.loading && !postCommentNotifications.error && postCommentNotifications.data) {
            return postCommentNotifications.data.getPostCommentNotificationsForUser.total
        }
        return 0
    }, [postCommentNotifications.loading, postCommentNotifications.error, postCommentNotifications.data])

    const fetchMorePostLikeNotifications = () => {
        postCommentNotifications.fetchMore({
            variables: { offset: comments.length, limit: comments.length > 3 ? 5 : 10 },
            updateQuery (existing, { fetchMoreResult } : { fetchMoreResult: GetPostCommentNotificationsForUserQueryType }) {
                return {
                    ...existing,
                    getPostCommentNotificationsForUser: {
                        ...existing.getPostCommentNotificationsForUser,
                        data: [
                            ...existing.getPostCommentNotificationsForUser.data,
                            ...fetchMoreResult.getPostCommentNotificationsForUser.data,
                        ]
                    }
                }
            }
        })
    }

    const infiniteScrollRef = useInfiniteScroll<HTMLDivElement>(fetchMorePostLikeNotifications)

    return (
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
            { comments.map(comment => (
                <Box
                    key={comment._id}
                    component='div'
                    paddingRight='8px'
                    sx={{ '&:hover': { backgroundColor: '#121212' }, cursor: 'pointer' }}
                    onClick={() => props.onClick(comment.post._id)}
                >
                    <Notification
                        key={comment._id}
                        type='comment'
                        user={comment.user}
                        photoURL={comment.post.photoURL}
                        createdAt={comment.createdAt} />
                </Box>
            )) }
            { comments.length < commentsTotal && (
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
            )}
        </Box>
    )
}