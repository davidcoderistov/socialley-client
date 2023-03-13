import { useMutation } from '@apollo/client'
import { FOLLOW_USER } from '../../../graphql/mutations/users'
import { useSnackbar } from 'notistack'
import { useUpdateNotificationUserFollowingLoadingStatus } from './useUpdateNotificationUserFollowingLoadingStatus'
import { useUpdateNotificationUserFollowingStatus } from './useUpdateNotificationUserFollowingStatus'


export function useFollowNotificationUser () {

    const { enqueueSnackbar } = useSnackbar()

    const [followUser] = useMutation(FOLLOW_USER)

    const updateFollowingLoadingStatus = useUpdateNotificationUserFollowingLoadingStatus()
    const updateFollowingStatus = useUpdateNotificationUserFollowingStatus()

    return (userId: string) => {
        updateFollowingLoadingStatus(userId, true)
        followUser({
            variables: {
                followedUserId: userId
            }
        }).then(() => {
            updateFollowingStatus(userId, true)
        }).catch(() => {
            updateFollowingLoadingStatus(userId, false)
            enqueueSnackbar('Could not follow user', { variant: 'error' })
        })
    }
}