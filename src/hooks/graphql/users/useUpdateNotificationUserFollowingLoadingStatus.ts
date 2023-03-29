import { useApolloClient } from '@apollo/client'
import { GET_FOLLOW_NOTIFICATIONS_FOR_USER } from '../../../graphql/queries/users'
import { GetFollowNotificationsForUserQueryType } from '../../../graphql/types/queries/users'
import followNotificationsForUserMutations from '../../../apollo/mutations/users/followNotificationsForUser'


export function useUpdateNotificationUserFollowingLoadingStatus () {

    const client = useApolloClient()

    return (userId: string, isFollowingLoading: boolean) => {
        client.cache.updateQuery({
            query: GET_FOLLOW_NOTIFICATIONS_FOR_USER
        }, (followNotificationsForUser: GetFollowNotificationsForUserQueryType | null) => {
            if (followNotificationsForUser) {
                return followNotificationsForUserMutations.updateFollowingLoadingStatus({
                    followNotificationsForUser,
                    userId,
                    isFollowingLoading,
                }).followNotificationsForUser
            }
        })
    }
}