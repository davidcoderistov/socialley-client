import { useMutation } from '@apollo/client'
import { useFollowUpdateUserConnections } from './useFollowUpdateUserConnections'
import { FOLLOW_USER } from '../../../graphql/mutations/users'
import { FollowUserMutationType } from '../../../graphql/types/mutations/users'
import { useSnackbar } from 'notistack'
import { useUpdateNotificationUserFollowingLoadingStatus } from './useUpdateNotificationUserFollowingLoadingStatus'
import { useUpdateNotificationUserFollowingStatus } from './useUpdateNotificationUserFollowingStatus'


export function useFollowNotificationUser () {

    const { enqueueSnackbar } = useSnackbar()

    const [followUser] = useMutation<FollowUserMutationType>(FOLLOW_USER)
    const updateFollowUserConnections = useFollowUpdateUserConnections()

    const updateFollowingLoadingStatus = useUpdateNotificationUserFollowingLoadingStatus()
    const updateFollowingStatus = useUpdateNotificationUserFollowingStatus()

    return (userId: string) => {
        updateFollowingLoadingStatus(userId, true)
        followUser({
            variables: {
                followedUserId: userId
            }
        }).then(follow => {
            updateFollowingStatus(userId, true)
            const followedUser = follow.data?.followUser
            if (followedUser) {
                updateFollowUserConnections({
                    followableUser: followedUser,
                    isFollowingLoading: false,
                })
            }
        }).catch(() => {
            updateFollowingLoadingStatus(userId, false)
            enqueueSnackbar('Could not follow user', { variant: 'error' })
        })
    }
}