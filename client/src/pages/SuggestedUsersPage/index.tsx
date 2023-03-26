import React, { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { useFollowSuggestedUser } from '../../hooks/graphql/users'
import { GET_SUGGESTED_USERS } from '../../graphql/queries/users'
import { GetSuggestedUsersQueryType } from '../../graphql/types/queries/users'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import FollowUserDetails from '../../components/FollowUserDetails'


export default function SuggestedUsersPage () {

    const suggestedUsers = useQuery<GetSuggestedUsersQueryType>(GET_SUGGESTED_USERS, {
        fetchPolicy: 'cache-only'
    })

    const [{ followUser, unfollowUser }] = useFollowSuggestedUser()

    const handleFollowUser = (userId: string) => {
        followUser(userId)
    }

    const handleUnfollowUser = (userId: string) => {
        unfollowUser(userId)
    }

    useEffect(() => {
        suggestedUsers.fetchMore({
            variables: {
                offset: 5,
                limit: 10,
            },
            updateQuery (existing, { fetchMoreResult }: { fetchMoreResult: GetSuggestedUsersQueryType }) {
                return {
                    ...existing,
                    getSuggestedUsers: {
                        ...existing.getSuggestedUsers,
                        data: [
                            ...existing.getSuggestedUsers.data,
                            ...fetchMoreResult.getSuggestedUsers.data,
                        ]
                    }
                }
            }
        })
    }, [])

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
                            { suggestedUsers.data && suggestedUsers.data.getSuggestedUsers.total > 0 ?
                                suggestedUsers.data.getSuggestedUsers.data.map(suggestedUser => (
                                    <FollowUserDetails
                                        key={suggestedUser.followableUser.user._id}
                                        user={{...suggestedUser, ...suggestedUser.followableUser, ...suggestedUser.followableUser.user}}
                                        onFollowUser={handleFollowUser}
                                        onUnfollowUser={handleUnfollowUser}
                                    />
                                )) : null }
                        </Box>
                    </Box>
                </Box>
                { suggestedUsers.loading && (
                    <Box
                        component='div'
                        display='flex'
                        flexDirection='column'
                        justifyContent='center'
                        alignItems='center'
                    >
                        <Box
                            component='div'
                            display='flex'
                            flexDirection='row'
                            justifyContent='center'
                            alignItems='flex-start'
                            height='50px'
                        >
                            <CircularProgress size={30} sx={{ color: '#FFFFFF', mt: 1 }} />
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    )
}