import React, { useState, useEffect, useMemo } from 'react'
import { useInfiniteScroll } from '../../hooks/misc'
import { useFollowNotificationUser, useUnfollowNotificationUser } from '../../hooks/graphql/users'
import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import { GET_FOLLOW_NOTIFICATIONS_FOR_USER } from '../../graphql/queries/users'
import { GetFollowNotificationsForUserQueryType } from '../../graphql/types/queries/users'
import { USER_FOLLOWED_SUBSCRIPTION } from '../../graphql/subscriptions/users'
import { UserFollowedSubscriptionType } from '../../graphql/types/subscriptions/users'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Notification from '../Notification'
import followNotificationsForUserMutations from '../../apollo/mutations/users/followNotificationsForUser'
import _uniqBy from 'lodash/uniqBy'


interface FollowNotificationsProps {
    visible: boolean
    onClick: (userId: string) => void
}

export default function FollowNotifications (props: FollowNotificationsProps) {

    const client = useApolloClient()

    const [offset, setOffset] = useState(3)
    const [followsTotal, setFollowsTotal] = useState(0)
    const [isFollowsTotalSet, setIsFollowsTotalSet] = useState(false)

    const followUser = useFollowNotificationUser()
    const unfollowUser = useUnfollowNotificationUser()

    const followNotifications = useQuery<GetFollowNotificationsForUserQueryType>(GET_FOLLOW_NOTIFICATIONS_FOR_USER)

    const follows = useMemo(() => {
        if (!followNotifications.loading && !followNotifications.error && followNotifications.data) {
            return followNotifications.data.getFollowNotificationsForUser.data
        }
        return []
    }, [followNotifications.loading, followNotifications.error, followNotifications.data])

    useEffect(() => {
        if (!followNotifications.loading && !followNotifications.error && followNotifications.data && !isFollowsTotalSet) {
            setFollowsTotal(followNotifications.data.getFollowNotificationsForUser.total)
            setIsFollowsTotalSet(true)
        }
    }, [followNotifications.loading, followNotifications.error, followNotifications.data, isFollowsTotalSet])

    const fetchMoreFollowNotifications = () => {
        const limit = follows.length > 3 ? 5 : 10
        followNotifications.fetchMore({
            variables: { offset, limit },
            updateQuery (existing, { fetchMoreResult } : { fetchMoreResult: GetFollowNotificationsForUserQueryType }) {
                return {
                    ...existing,
                    getFollowNotificationsForUser: {
                        ...existing.getFollowNotificationsForUser,
                        data: _uniqBy([
                            ...existing.getFollowNotificationsForUser.data,
                            ...fetchMoreResult.getFollowNotificationsForUser.data,
                        ], followNotification => followNotification.followableUser.user._id)
                    }
                }
            }
        }).then(() => setOffset(offset + limit))
    }

    const infiniteScrollRef = useInfiniteScroll<HTMLDivElement>(fetchMoreFollowNotifications)

    const handleFollowUser = (userId: string, event: React.MouseEvent) => {
        event.stopPropagation()
        followUser(userId)
    }

    const handleUnfollowUser = (userId: string) => {
        unfollowUser(userId)
    }

    useSubscription<UserFollowedSubscriptionType>(USER_FOLLOWED_SUBSCRIPTION, {
        onData ({ data }) {
            if (!data.error && data.data) {
                const followNotification = data.data.userFollowed
                client.cache.updateQuery({
                    query: GET_FOLLOW_NOTIFICATIONS_FOR_USER
                }, (followNotificationsForUser: GetFollowNotificationsForUserQueryType | null) => {
                    if (followNotificationsForUser) {
                        return followNotificationsForUserMutations.addFollowNotification({
                            followNotificationsForUser,
                            followNotification,
                        }).followNotificationsForUser
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
            { follows.map(follow => (
                <Box
                    key={follow._id}
                    component='div'
                    paddingRight='8px'
                    sx={{ '&:hover': { backgroundColor: '#121212' }, cursor: 'pointer' }}
                    onClick={() => props.onClick(follow.followableUser.user._id)}
                >
                    <Notification
                        key={follow._id}
                        type='follow'
                        user={{...follow.followableUser, ...follow.followableUser.user, isFollowingLoading: follow.isFollowingLoading}}
                        createdAt={follow.createdAt}
                        onFollowUser={handleFollowUser}
                        onUnfollowUser={handleUnfollowUser} />
                </Box>
            )) }
            { offset < followsTotal && (
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