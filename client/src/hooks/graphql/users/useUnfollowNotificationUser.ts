import { useUnfollowUser } from './useUnfollowUser'
import { useUpdateNotificationUserFollowingLoadingStatus } from './useUpdateNotificationUserFollowingLoadingStatus'
import { useUpdateNotificationUserFollowingStatus } from './useUpdateNotificationUserFollowingStatus'


export function useUnfollowNotificationUser () {

    const unfollowUser = useUnfollowUser()
    const updateFollowingLoadingStatus = useUpdateNotificationUserFollowingLoadingStatus()
    const updateFollowingStatus = useUpdateNotificationUserFollowingStatus()

    return (userId: string) => {
        unfollowUser(userId, {
            onStart () {
                updateFollowingLoadingStatus(userId, true)
            },
            onSuccess () {
                updateFollowingStatus(userId, false)
            },
            onError () {
                updateFollowingLoadingStatus(userId, false)
            }
        })
    }
}