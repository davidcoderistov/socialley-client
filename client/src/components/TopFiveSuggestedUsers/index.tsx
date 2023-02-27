import React from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { GET_SUGGESTED_USERS } from '../../graphql/queries/users'
import { GetSuggestedUsersQueryType } from '../../graphql/types/queries/users'
import { FOLLOW_USER, UNFOLLOW_USER } from '../../graphql/mutations/users'
import { UnfollowUserMutationType } from '../../graphql/types/mutations/users'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import FollowUserDetails from '../FollowUserDetails'
import _range from 'lodash/range'
import suggestedUsersMutations from '../../apollo/mutations/users/suggestedUsers'


export default function TopFiveSuggestedUsers () {

    const { enqueueSnackbar } = useSnackbar()

    const suggestedUsers = useQuery<GetSuggestedUsersQueryType>(GET_SUGGESTED_USERS)

    const [followUser] = useMutation(FOLLOW_USER)
    const [unfollowUser] = useMutation<UnfollowUserMutationType>(UNFOLLOW_USER)

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

    return (
        <Box
            component='div'
            width='400px'
        >
            <Box
                component='div'
                display='flex'
                flexDirection='row'
                justifyContent='space-between'
                alignItems='center'
                paddingBottom='5px'
            >
                <Typography
                    fontSize={14}
                    color='#A8A8A8'
                    noWrap
                >
                    { suggestedUsers.data && suggestedUsers.data.getSuggestedUsers.length > 0 && 'Suggestions for you' }
                </Typography>
                { suggestedUsers.data && suggestedUsers.data.getSuggestedUsers.length > 5 && (
                    <Button
                        variant='text'
                        sx={{
                            textTransform: 'none',
                            color: '#FFFFFF',
                            '&:hover': {
                                color: '#A8A8A8'
                            }
                        }}
                    >
                        See All
                    </Button>
                )}
            </Box>
            { suggestedUsers.loading ? _range(5).map(index => (
                <FollowUserDetails
                    key={index}
                    isUserLoading={true}
                    dense={true}
                    dark={false} />
            )) : suggestedUsers.data && suggestedUsers.data.getSuggestedUsers.length > 0 ?
                suggestedUsers.data.getSuggestedUsers.slice(0, 5).map(suggestedUser => (
                    <FollowUserDetails
                        key={suggestedUser.followableUser.user._id}
                        user={{...suggestedUser, ...suggestedUser.followableUser, ...suggestedUser.followableUser.user}}
                        dense={true}
                        dark={false}
                        onFollowUser={handleFollowUser}
                        onUnfollowUser={handleUnfollowUser}
                    />
                )) : null }
        </Box>
    )
}

