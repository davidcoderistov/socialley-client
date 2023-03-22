import { useQuery } from '@apollo/client'
import { useFollowUser } from './useFollowUser'
import { useUnfollowUser } from './useUnfollowUser'
import { GET_SUGGESTED_USERS } from '../../../graphql/queries/users'
import { GetSuggestedUsersQueryType } from '../../../graphql/types/queries/users'
import suggestedUsersMutations from '../../../apollo/mutations/users/suggestedUsers'


export function useFollowSuggestedUser () {

    const suggestedUsers = useQuery<GetSuggestedUsersQueryType>(GET_SUGGESTED_USERS)

    const followUser = useFollowUser()
    const unfollowUser = useUnfollowUser()

    const updateSuggestedUserFollowingLoadingStatus = (userId: string, isFollowingLoading: boolean) => {
        suggestedUsers.updateQuery((suggestedUsers) => {
            return suggestedUsersMutations.updateFollowingLoadingStatus({
                suggestedUsers,
                userId,
                isFollowingLoading,
            }).suggestedUsers
        })
    }

    const updateSuggestedUserFollowingStatus = (userId: string, following: boolean) => {
        suggestedUsers.updateQuery((suggestedUsers) => {
            return suggestedUsersMutations.updateFollowingStatus({
                suggestedUsers,
                userId,
                following,
            }).suggestedUsers
        })
    }

    const handleFollowUser = (userId: string) => {
        followUser(userId, {
            onStart () {
                updateSuggestedUserFollowingLoadingStatus(userId, true)
            },
            onSuccess () {
                updateSuggestedUserFollowingStatus(userId, true)
            },
            onError () {
                updateSuggestedUserFollowingLoadingStatus(userId, false)
            }
        })
    }

    const handleUnfollowUser = (userId: string) => {
        unfollowUser(userId, {
            onStart () {
                updateSuggestedUserFollowingLoadingStatus(userId, true)
            },
            onSuccess () {
                updateSuggestedUserFollowingStatus(userId, false)
            },
            onError () {
                updateSuggestedUserFollowingLoadingStatus(userId, false)
            }
        })
    }

    return [{ followUser: handleFollowUser, unfollowUser: handleUnfollowUser }] as const
}