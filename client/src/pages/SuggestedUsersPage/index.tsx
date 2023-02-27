import React from 'react'
import { useQuery } from '@apollo/client'
import { useFollowSuggestedUser } from '../../hooks/graphql/users'
import { GET_SUGGESTED_USERS } from '../../graphql/queries/users'
import { GetSuggestedUsersQueryType } from '../../graphql/types/queries/users'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FollowUserDetails from '../../components/FollowUserDetails'


export default function SuggestedUsersPage () {

    const suggestedUsers = useQuery<GetSuggestedUsersQueryType>(GET_SUGGESTED_USERS)

    const [{ followUser, unfollowUser }] = useFollowSuggestedUser()

    const handleFollowUser = (userId: string) => {
        followUser(userId)
    }

    const handleUnfollowUser = (userId: string) => {
        unfollowUser(userId)
    }

    return (
        <Box
            component='div'
            display='flex'
            flexDirection='column'
            bgcolor='#000000'
            width='100%'
            flexGrow='1'
        >
            <Box
                component='div'
                display='flex'
                flexDirection='column'
                alignItems='stretch'
                border='0'
                flexGrow='1'
                flexShrink='0'
                margin='0 auto'
                maxWidth='650px'
                paddingY='60px'
                paddingX='0'
                boxSizing='border-box'
                position='relative'
                width='100%'
                sx={{ verticalAlign: 'baseline' }}
            >
                <Box
                    component='div'
                    paddingX='12px'
                    marginTop='16px'
                    marginBottom='12px'
                    display='flex'
                    flex='0 0 auto'
                    justifyContent='flex-start'
                    flexDirection='column'
                    alignItems='stretch'
                    alignContent='stretch'
                    boxSizing='border-box'
                    position='relative'
                >
                    <Typography
                        color='#FFFFFF'
                        noWrap
                    >Suggested</Typography>
                </Box>
                <Box
                    component='div'
                    paddingY='8px'
                    flex='0 0 auto'
                    justifyContent='flex-start'
                    flexDirection='column'
                    alignItems='stretch'
                    alignContent='stretch'
                    display='flex'
                    boxSizing='border-box'
                    position='relative'
                >
                    <Box
                        component='div'
                        display='block'
                        overflow='hidden'
                    >
                        <Box
                            component='div'
                            display='flex'
                            flexDirection='column'
                            position='relative'
                            paddingY='0'
                        >
                            { suggestedUsers.data && suggestedUsers.data.getSuggestedUsers.length > 0 ?
                                suggestedUsers.data.getSuggestedUsers.map(suggestedUser => (
                                    <FollowUserDetails
                                        key={suggestedUser.followableUser.user._id}
                                        user={{...suggestedUser, ...suggestedUser.followableUser, ...suggestedUser.followableUser.user}}
                                        dense={false}
                                        dark={false}
                                        onFollowUser={handleFollowUser}
                                        onUnfollowUser={handleUnfollowUser}
                                    />
                                )) : null }
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}