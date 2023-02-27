import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { useFollowSuggestedUser } from '../../hooks/graphql/users'
import { GET_SUGGESTED_USERS } from '../../graphql/queries/users'
import { GetSuggestedUsersQueryType } from '../../graphql/types/queries/users'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import FollowUserDetails from '../FollowUserDetails'
import _range from 'lodash/range'


export default function TopFiveSuggestedUsers () {

    const navigate = useNavigate()

    const suggestedUsers = useQuery<GetSuggestedUsersQueryType>(GET_SUGGESTED_USERS)

    const [{ followUser, unfollowUser }] = useFollowSuggestedUser()

    const handleFollowUser = (userId: string) => {
        followUser(userId)
    }

    const handleUnfollowUser = (userId: string) => {
        unfollowUser(userId)
    }

    const handleClickSeeAll = () => {
        navigate('/suggested-users')
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
                        onClick={handleClickSeeAll}
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

