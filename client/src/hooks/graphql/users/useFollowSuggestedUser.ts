import { useQuery, useMutation } from '@apollo/client'
import { GET_SUGGESTED_USERS } from '../../../graphql/queries/users'
import { GetSuggestedUsersQueryType } from '../../../graphql/types/queries/users'
import { FOLLOW_USER, UNFOLLOW_USER } from '../../../graphql/mutations/users'
import suggestedUsersMutations from '../../../apollo/mutations/users/suggestedUsers'
import { useSnackbar } from 'notistack'


export function useFollowSuggestedUser () {

    const { enqueueSnackbar } = useSnackbar()

    const suggestedUsers = useQuery<GetSuggestedUsersQueryType>(GET_SUGGESTED_USERS)

    const [followUser] = useMutation(FOLLOW_USER)
    const [unfollowUser] = useMutation(UNFOLLOW_USER)

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
        updateSuggestedUserFollowingLoadingStatus(userId, true)
        followUser({
            variables: {
                followedUserId: userId
            }
        }).then(() => {
            updateSuggestedUserFollowingStatus(userId, true)
        }).catch(() => {
            updateSuggestedUserFollowingLoadingStatus(userId, false)
            enqueueSnackbar('Could not follow user', { variant: 'error' })
        })
    }

    const handleUnfollowUser = (userId: string) => {
        updateSuggestedUserFollowingLoadingStatus(userId, true)
        unfollowUser({
            variables: {
                followedUserId: userId
            }
        }).then(() => {
            updateSuggestedUserFollowingStatus(userId, false)
        }).catch(() => {
            updateSuggestedUserFollowingLoadingStatus(userId, false)
            enqueueSnackbar('Could not unfollow user', { variant: 'error' })
        })
    }

    return [{ followUser: handleFollowUser, unfollowUser: handleUnfollowUser }] as const
}