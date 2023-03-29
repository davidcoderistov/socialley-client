import React, { useMemo } from 'react'
import { useInfiniteScroll, useFetchMore } from '../../hooks/misc'
import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import { GET_POST_COMMENT_NOTIFICATIONS_FOR_USER } from '../../graphql/queries/posts'
import { GetPostCommentNotificationsForUserQueryType } from '../../graphql/types/queries/posts'
import { POST_COMMENTED_SUBSCRIPTION } from '../../graphql/subscriptions/posts'
import { PostCommentedSubscriptionType } from '../../graphql/types/subscriptions/posts'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Notification from '../Notification'
import { addPostCommentNotification } from '../../apollo/mutations/posts/postCommentNotificationsForUser'


interface PostCommentNotificationsProps {
    visible: boolean
    onClick: (postId: string) => void
}

export default function PostCommentNotifications (props: PostCommentNotificationsProps) {

    const client = useApolloClient()

    const postCommentNotifications = useQuery<GetPostCommentNotificationsForUserQueryType>(
        GET_POST_COMMENT_NOTIFICATIONS_FOR_USER,
        { skip: !props.visible }
    )

    const fetchMorePostCommentNotifications = useFetchMore<GetPostCommentNotificationsForUserQueryType>({
        queryName: 'getPostCommentNotificationsForUser',
        queryResult: postCommentNotifications,
        updateQuery (existing, incoming) {
            return {
                ...existing,
                getPostCommentNotificationsForUser: {
                    ...existing.getPostCommentNotificationsForUser,
                    data: [
                        ...existing.getPostCommentNotificationsForUser.data,
                        ...incoming.getPostCommentNotificationsForUser.data,
                    ]
                }
            }
        }
    })

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

    const handleFetchMorePostCommentNotifications = () => {
        if (postCommentNotifications.data) {
            fetchMorePostCommentNotifications({
                variables: {
                    offset: postCommentNotifications.data.getPostCommentNotificationsForUser.data.length,
                    limit: 10,
                }
            })
        }
    }

    const infiniteScrollRef = useInfiniteScroll<HTMLDivElement>(handleFetchMorePostCommentNotifications)

    useSubscription<PostCommentedSubscriptionType>(POST_COMMENTED_SUBSCRIPTION, {
        onData ({ data }) {
            if (!data.error && data.data) {
                const postCommentNotification = data.data.postCommented
                client.cache.updateQuery({
                    query: GET_POST_COMMENT_NOTIFICATIONS_FOR_USER
                }, (postCommentNotificationsForUser: GetPostCommentNotificationsForUserQueryType | null) => {
                    if (postCommentNotificationsForUser) {
                        return addPostCommentNotification({
                            postCommentNotificationsForUser,
                            postCommentNotification,
                        }).postCommentNotificationsForUser
                    }
                })
            }
        }
    })

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
            { postCommentNotifications.data && postCommentNotifications.data.getPostCommentNotificationsForUser.data.length < commentsTotal && (
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