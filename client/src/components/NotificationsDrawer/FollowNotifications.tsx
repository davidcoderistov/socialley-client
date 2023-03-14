import React, { useMemo } from 'react'
import { useInfiniteScroll } from '../../hooks/misc'
import { useFollowNotificationUser, useUnfollowNotificationUser } from '../../hooks/graphql/users'
import { useQuery } from '@apollo/client'
import { GET_FOLLOW_NOTIFICATIONS_FOR_USER } from '../../graphql/queries/users'
import { GetFollowNotificationsForUserQueryType } from '../../graphql/types/queries/users'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Notification from '../Notification'


interface FollowNotificationsProps {
    visible: boolean
    onClick: (userId: string) => void
}

export default function FollowNotifications (props: FollowNotificationsProps) {

    const followUser = useFollowNotificationUser()
    const unfollowUser = useUnfollowNotificationUser()

    const followNotifications = useQuery<GetFollowNotificationsForUserQueryType>(GET_FOLLOW_NOTIFICATIONS_FOR_USER)

    const follows = useMemo(() => {
        if (!followNotifications.loading && !followNotifications.error && followNotifications.data) {
            return followNotifications.data.getFollowNotificationsForUser.data
        }
        return []
    }, [followNotifications.loading, followNotifications.error, followNotifications.data])

    const followsTotal = useMemo(() => {
        if (!followNotifications.loading && !followNotifications.error && followNotifications.data) {
            return followNotifications.data.getFollowNotificationsForUser.total
        }
        return 0
    }, [followNotifications.loading, followNotifications.error, followNotifications.data])

    const fetchMoreFollowNotifications = () => {
        followNotifications.fetchMore({
            variables: { offset: follows.length, limit: follows.length > 3 ? 5 : 10 },
            updateQuery (existing, { fetchMoreResult } : { fetchMoreResult: GetFollowNotificationsForUserQueryType }) {
                return {
                    ...existing,
                    getFollowNotificationsForUser: {
                        ...existing.getFollowNotificationsForUser,
                        data: [
                            ...existing.getFollowNotificationsForUser.data,
                            ...fetchMoreResult.getFollowNotificationsForUser.data,
                        ]
                    }
                }
            }
        })
    }

    const infiniteScrollRef = useInfiniteScroll<HTMLDivElement>(fetchMoreFollowNotifications)

    const handleFollowUser = (userId: string, event: React.MouseEvent) => {
        event.stopPropagation()
        followUser(userId)
    }

    const handleUnfollowUser = (userId: string) => {
        unfollowUser(userId)
    }

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
            { follows.length < followsTotal && (
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