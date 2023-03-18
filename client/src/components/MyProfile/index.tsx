import React, { useState, useMemo } from 'react'
import { useLoggedInUser } from '../../hooks/misc'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { GET_USER_DETAILS } from '../../graphql/queries/users'
import { GetUserDetailsQueryType } from '../../graphql/types/queries/users'
import Box from '@mui/material/Box'
import { Tabs, Tab } from '@mui/material'
import { ViewList, Bookmark, Favorite } from '@mui/icons-material'
import UserProfileDetails from '../UserProfileDetails'
import UserPostsFeed from '../UserPostsFeed'
import UserFavoritePostsFeed from '../UserFavoritePostsFeed'
import UserLikedPostsFeed from '../UserLikedPostsFeed'


export default function MyProfile () {

    const [loggedInUser] = useLoggedInUser()

    const navigate = useNavigate()
    const { id: postId } = useParams()

    const userDetails = useQuery<GetUserDetailsQueryType>(GET_USER_DETAILS, { variables: { userId: loggedInUser._id }})

    const user = useMemo(() => {
        return userDetails.data?.getUserDetails ?? null
    }, [userDetails.data])

    const [tabIndex, setTabIndex] = useState(0)

    const handleChangeTabIndex = (event: React.SyntheticEvent, tabIndex: number) => {
        setTabIndex(tabIndex)
    }

    const handleEditProfile = () => {
        navigate('/profile/settings')
    }

    return (
        <Box
            component='div'
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            width='100%'
        >
            <Box
                component='div'
                width='75%'
            >
                { userDetails.loading ? (
                    <UserProfileDetails loading />
                ) : user ? (
                    <UserProfileDetails
                        isLoggedInUserProfile={true}
                        _id={user.followableUser.user._id}
                        username={user.followableUser.user.username}
                        firstName={user.followableUser.user.firstName}
                        lastName={user.followableUser.user.lastName}
                        avatarURL={user.followableUser.user.avatarURL}
                        postsCount={user.postsCount}
                        followersCount={user.followersCount}
                        followingCount={user.followingCount}
                        onEditProfile={handleEditProfile}
                        onClickOptions={() => {}} />
                ) : null }
            </Box>
            <Box
                component='div'
                justifyContent='center'
                margin='0'
                padding='0'
                display='flex'
                alignItems='center'
                textAlign='center'
                borderTop='1px solid #262626'
                boxSizing='border-box'
                flexDirection='row'
                position='relative'
                width='75%'
            >
                <Tabs
                    value={tabIndex}
                    onChange={handleChangeTabIndex}
                    TabIndicatorProps={{
                        sx: {
                            top: 0,
                            backgroundColor: '#FFFFFF'
                        }
                    }}
                    centered
                >
                    <Tab
                        icon={<ViewList sx={{ fontSize: 20 }} />}
                        iconPosition='start'
                        label='Posts'
                        sx={{ color: '#8E8E8E', fontSize: 12, '&.Mui-selected': { color: '#FFFFFF' }}} />
                    <Tab
                        icon={<Bookmark sx={{ fontSize: 20 }} />}
                        iconPosition='start'
                        label='Favorite'
                        sx={{ color: '#8E8E8E', fontSize: 12, '&.Mui-selected': { color: '#FFFFFF' }}} />
                    <Tab
                        icon={<Favorite sx={{ fontSize: 20 }} />}
                        iconPosition='start'
                        label='Liked'
                        sx={{ color: '#8E8E8E', fontSize: 12, '&.Mui-selected': { color: '#FFFFFF' }}} />
                </Tabs>
            </Box>
            <Box
                component='div'
                margin='0'
                padding='0'
                boxSizing='border-box'
                position='relative'
                width='75%'
            >
                <UserPostsFeed
                    userId={loggedInUser._id}
                    postId={postId}
                    boxProps={{ marginBottom: '40px', ...tabIndex !== 0 && { display: 'none' } }}
                    dense
                    shouldSkipQuery={tabIndex !== 0} />
                <UserFavoritePostsFeed
                    boxProps={{ marginBottom: '40px', ...tabIndex !== 1 && { display: 'none' } }}
                    dense
                    shouldSkipQuery={tabIndex !== 1} />
                <UserLikedPostsFeed
                    boxProps={{ marginBottom: '40px', ...tabIndex !== 2 && { display: 'none' } }}
                    dense
                    shouldSkipQuery={tabIndex !== 2} />
            </Box>
        </Box>
    )
}