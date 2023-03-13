import { useMutation } from '@apollo/client'
import { UNFOLLOW_USER } from '../../../graphql/mutations/users'
import { useSnackbar } from 'notistack'
import { useUpdateNotificationUserFollowingLoadingStatus } from './useUpdateNotificationUserFollowingLoadingStatus'
import { useUpdateNotificationUserFollowingStatus } from './useUpdateNotificationUserFollowingStatus'


export function useUnfollowNotificationUser () {

    const { enqueueSnackbar } = useSnackbar()

    const [unfollowUser] = useMutation(UNFOLLOW_USER)

    const updateFollowingLoadingStatus = useUpdateNotificationUserFollowingLoadingStatus()
    const updateFollowingStatus = useUpdateNotificationUserFollowingStatus()

    return (userId: string) => {
        updateFollowingLoadingStatus(userId, true)
        unfollowUser({
            variables: {
                followedUserId: userId
            }
        }).then(() => {
            updateFollowingStatus(userId, false)
        }).catch(() => {
            updateFollowingLoadingStatus(userId, false)
            enqueueSnackbar('Could not unfollow user', { variant: 'error' })
        })
    }
}