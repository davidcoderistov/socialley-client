import React, { useState, useEffect, useMemo } from 'react'
import { useInfiniteScroll, useFetchMore } from '../../hooks/misc'
import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import { GET_POST_LIKE_NOTIFICATIONS_FOR_USER } from '../../graphql/queries/posts'
import { GetPostLikeNotificationsForUserQueryType } from '../../graphql/types/queries/posts'
import { POST_LIKED_SUBSCRIPTION } from '../../graphql/subscriptions/posts'
import { PostLikedSubscriptionType } from '../../graphql/types/subscriptions/posts'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Notification from '../Notification'
import { addPostLikeNotification } from '../../apollo/mutations/posts/postLikeNotificationsForUser'
import _uniqWith from 'lodash/uniqWith'


interface PostLikeNotificationsProps {
    visible: boolean
    onClick: (postId: string) => void
}

export default function PostLikeNotifications (props: PostLikeNotificationsProps) {

    const client = useApolloClient()

    const [likesTotal, setLikesTotal] = useState(0)
    const [isLikesTotalSet, setIsLikesTotalSet] = useState(false)

    const postLikeNotifications = useQuery<GetPostLikeNotificationsForUserQueryType>(GET_POST_LIKE_NOTIFICATIONS_FOR_USER)

    const fetchMorePostLikeNotifications = useFetchMore<GetPostLikeNotificationsForUserQueryType>({
        queryName: 'getPostLikeNotificationsForUser',
        queryResult: postLikeNotifications,
        updateQuery (existing, incoming) {
            return {
                ...existing,
                getPostLikeNotificationsForUser: {
                    ...existing.getPostLikeNotificationsForUser,
                    data: _uniqWith([
                        ...existing.getPostLikeNotificationsForUser.data,
                        ...incoming.getPostLikeNotificationsForUser.data,
                    ], (first, second) =>
                        first.post._id === second.post._id && first.user._id === second.user._id)
                }
            }
        }
    })

    const likes = useMemo(() => {
        if (!postLikeNotifications.loading && !postLikeNotifications.error && postLikeNotifications.data) {
            return postLikeNotifications.data.getPostLikeNotificationsForUser.data
        }
        return []
    }, [postLikeNotifications.loading, postLikeNotifications.error, postLikeNotifications.data])

    useEffect(() => {
        if (!postLikeNotifications.loading && !postLikeNotifications.error && postLikeNotifications.data && !isLikesTotalSet) {
            setLikesTotal(postLikeNotifications.data.getPostLikeNotificationsForUser.total)
            setIsLikesTotalSet(true)
        }
    }, [postLikeNotifications.loading, postLikeNotifications.error, postLikeNotifications.data, isLikesTotalSet])

    const handleFetchMorePostLikeNotifications = () => {
        if (postLikeNotifications.data) {
            fetchMorePostLikeNotifications({
                variables: {
                    offset: postLikeNotifications.data.getPostLikeNotificationsForUser.data.length,
                    limit: 10,
                }
            })
        }
    }

    const infiniteScrollRef = useInfiniteScroll<HTMLDivElement>(handleFetchMorePostLikeNotifications)

    useSubscription<PostLikedSubscriptionType>(POST_LIKED_SUBSCRIPTION, {
        onData ({ data }) {
            if (!data.error && data.data) {
                const postLikeNotification = data.data.postLiked
                client.cache.updateQuery({
                    query: GET_POST_LIKE_NOTIFICATIONS_FOR_USER
                }, (postLikeNotificationsForUser: GetPostLikeNotificationsForUserQueryType | null) => {
                    if (postLikeNotificationsForUser) {
                        return addPostLikeNotification({
                            postLikeNotificationsForUser,
                            postLikeNotification,
                        }).postLikeNotificationsForUser
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
            { postLikeNotifications.data && postLikeNotifications.data.getPostLikeNotificationsForUser.data.length < likesTotal && (
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