import { useFollowUser } from './useFollowUser'
import { useUpdateNotificationUserFollowingLoadingStatus } from './useUpdateNotificationUserFollowingLoadingStatus'
import { useUpdateNotificationUserFollowingStatus } from './useUpdateNotificationUserFollowingStatus'


export function useFollowNotificationUser () {

    const followUser = useFollowUser()

    const updateFollowingLoadingStatus = useUpdateNotificationUserFollowingLoadingStatus()
    const updateFollowingStatus = useUpdateNotificationUserFollowingStatus()

    return (userId: string) => {
        followUser(userId, {
            onStart () {
                updateFollowingLoadingStatus(userId, true)
            },
            onSuccess () {
                updateFollowingStatus(userId, true)
            },
            onError () {
                updateFollowingLoadingStatus(userId, false)
            }
        })
    }
}