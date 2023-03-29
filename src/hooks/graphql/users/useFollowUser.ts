import { useMutation } from '@apollo/client'
import { useFollowUpdateUserConnections } from './useFollowUpdateUserConnections'
import { useSnackbar } from 'notistack'
import { FOLLOW_USER } from '../../../graphql/mutations/users'
import { FollowUserMutationType } from '../../../graphql/types/mutations/users'


interface FollowUserCallbackProps {
    onStart: () => void
    onSuccess: () => void
    onError: () => void
}

export function useFollowUser () {

    const { enqueueSnackbar } = useSnackbar()

    const [followUser] = useMutation<FollowUserMutationType>(FOLLOW_USER)
    const updateFollowUserConnections = useFollowUpdateUserConnections()

    return (userId: string, { onStart, onSuccess, onError }: FollowUserCallbackProps) => {
        onStart()
        followUser({
            variables: {
                followedUserId: userId
            }
        }).then(follow => {
            const followedUser = follow.data?.followUser
            if (followedUser) {
                updateFollowUserConnections({
                    followableUser: followedUser,
                    isFollowingLoading: false,
                })
            }
            onSuccess()
        }).catch(() => {
            onError()
            enqueueSnackbar('Could not follow user', { variant: 'error' })
        })
    }
}