import React, { useMemo } from 'react'
import { useInfiniteScroll } from '../../hooks/misc'
import { useQuery } from '@apollo/client'
import { GET_POST_LIKE_NOTIFICATIONS_FOR_USER } from '../../graphql/queries/posts'
import { GetPostLikeNotificationsForUserQueryType } from '../../graphql/types/queries/posts'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Notification from '../Notification'
import { PostLikeNotification } from '../../graphql/types/models'


interface PostLikeNotificationsProps {
    visible: boolean
    onClick: (postId: string) => void
}

export default function PostLikeNotifications (props: PostLikeNotificationsProps) {

    const postLikeNotifications = useQuery(GET_POST_LIKE_NOTIFICATIONS_FOR_USER)

    const likes: PostLikeNotification[] = useMemo(() => {
        if (!postLikeNotifications.loading && !postLikeNotifications.error && postLikeNotifications.data) {
            return postLikeNotifications.data.getPostLikeNotificationsForUser.data
        }
        return []
    }, [postLikeNotifications.loading, postLikeNotifications.error, postLikeNotifications.data])

    const likesTotal = useMemo(() => {
        if (!postLikeNotifications.loading && !postLikeNotifications.error && postLikeNotifications.data) {
            return postLikeNotifications.data.getPostLikeNotificationsForUser.total
        }
        return 0
    }, [postLikeNotifications.loading, postLikeNotifications.error, postLikeNotifications.data])

    const fetchMorePostLikeNotifications = () => {
        postLikeNotifications.fetchMore({
            variables: { offset: likes.length, limit: likes.length > 3 ? 5 : 10 },
            updateQuery (existing, { fetchMoreResult } : { fetchMoreResult: GetPostLikeNotificationsForUserQueryType }) {
                return {
                    ...existing,
                    getPostLikeNotificationsForUser: {
                        ...existing.getPostLikeNotificationsForUser,
                        data: [
                            ...existing.getPostLikeNotificationsForUser.data,
                            ...fetchMoreResult.getPostLikeNotificationsForUser.data,
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
            { likes.map(like => (
                <Box
                    key={like._id}
                    component='div'
                    paddingRight='8px'
                    sx={{ '&:hover': { backgroundColor: '#121212' }, cursor: 'pointer' }}
                    onClick={() => props.onClick(like.post._id)}
                >
                    <Notification
                        key={like._id}
                        type='post'
                        user={like.user}
                        photoURL={like.post.photoURL}
                        createdAt={like.createdAt} />
                </Box>
            )) }
            { likes.length < likesTotal && (
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