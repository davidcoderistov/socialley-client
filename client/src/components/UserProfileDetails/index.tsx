import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import { Settings, MoreHoriz } from '@mui/icons-material'
import UserActionButton from '../UserActionButton'
import FollowButton from '../FollowButton'
import FollowingButton from '../FollowingButton'
import UserAvatar from '../UserAvatar'


interface LoggedInUserProfileProps {
    loading?: never
    isLoggedInUserProfile: true
    _id: string
    username: string
    firstName: string
    lastName: string
    postsCount: number
    followersCount: number
    followingCount: number
    following?: never
    isFollowingLoading?: never
    latestMutualFollower?: never
    mutualFollowersCount?: never
    onFollowUser?: never
    onUnfollowUser?: never
    onEditProfile: () => void
    onClickOptions: () => void
}

interface UserProfileDetailsProps {
    loading?: never
    isLoggedInUserProfile: false
    _id: string
    username: string
    firstName: string
    lastName: string
    postsCount: number
    followersCount: number
    followingCount: number
    following: boolean
    isFollowingLoading: boolean
    latestMutualFollower: {
        _id: string
        username: string
    } | null
    mutualFollowersCount: number
    onFollowUser: (userId: string) => void
    onUnfollowUser: (userId: string) => void
    onEditProfile?: never
    onClickOptions: () => void
}

interface UserProfileLoadingDetailsProps {
    loading: true
    isLoggedInUserProfile?: never
    _id?: never
    username?: never
    firstName?: never
    lastName?: never
    postsCount?: never
    followersCount?: never
    followingCount?: never
    following?: never
    isFollowingLoading?: never
    latestMutualFollower?: never
    mutualFollowersCount?: never
    onFollowUser?: never
    onUnfollowUser?: never
    onEditProfile?: never
    onClickOptions?: never
}

type Props = LoggedInUserProfileProps | UserProfileDetailsProps | UserProfileLoadingDetailsProps

export default function UserProfileDetails (props: Props) {

    const handleFollowUser = () => {
        if (!props.loading && !props.isLoggedInUserProfile) {
            props.onFollowUser(props._id)
        }
    }

    const handleUnfollowUser = () => {
        if (!props.loading && !props.isLoggedInUserProfile) {
            props.onUnfollowUser(props._id)
        }
    }

    return (
        <Box
            component='div'
            marginBottom='44px'
            display='flex'
            flexShrink='0'
            alignItems='stretch'
            flexDirection='row'
            position='relative'
        >
            <Box
                component='div'
                marginRight='30px'
                flexGrow='1'
                flexBasis='0'
                justifyContent='flex-start'
                flexDirection='column'
                display='flex'
                flexShrink='0'
                position='relative'
            >
                <Box
                    component='div'
                    display='block'
                    flex='none'
                    position='relative'
                    alignSelf='center'
                >
                    { props.loading ? (
                        <Skeleton
                            component='div'
                            animation='wave'
                            variant='circular'
                            width='150px'
                            height='150px'
                            sx={{ backgroundColor: '#2C3539' }} />
                    ) : (
                        <UserAvatar
                            firstName={props.firstName}
                            lastName={props.lastName}
                            size={150} />
                    )}
                </Box>
            </Box>
            <Box
                component='div'
                flexGrow='2'
                flexBasis='30px'
                flexShrink='1'
                minWidth='0'
                flexDirection='column'
                margin='0'
                padding='0'
                border='0'
                boxSizing='border-box'
                display='flex'
                alignItems='stretch'
                position='relative'
                sx={{ verticalAlign: 'baseline' }}
            >
                <Box
                    component='div'
                    flexShrink='1'
                    minWidth='0'
                    display='flex'
                    alignItems='center'
                    flexDirection='row'
                    position='relative'
                    marginBottom='20px'
                >
                    <Typography sx={{ fontSize: 20 }}>
                        { props.loading ? (
                            <Skeleton sx={{ backgroundColor: '#2C3539' }} animation='wave' width='240px' />
                        ): props.username }
                    </Typography>
                    { !props.loading && (
                        <>
                            <Box
                                component='div'
                                marginLeft='20px'
                                flex='0 0 auto'
                                justifyContent='flex-start'
                                flexDirection='row'
                                alignItems='stretch'
                                alignContent='stretch'
                                display='flex'
                                boxSizing='border-box'
                                position='relative'
                            >
                                { props.isLoggedInUserProfile ? (
                                    <UserActionButton
                                        variant='secondary'
                                        text='Edit profile'
                                        contained={true}
                                        loading={false}
                                        onClick={props.onEditProfile} />
                                ) : props.following ? (
                                    <FollowingButton
                                        contained={true}
                                        loading={props.isFollowingLoading}
                                        onClick={handleUnfollowUser} />
                                ) : (
                                    <FollowButton
                                        contained={true}
                                        loading={props.isFollowingLoading}
                                        onClick={handleFollowUser} />
                                ) }
                            </Box>
                            <Box
                                component='div'
                                marginLeft='5px'
                                flexShrink='0'
                                display='block'
                            >
                                <IconButton sx={{ color: '#FFFFFF' }} onClick={props.onClickOptions}>
                                    { props.isLoggedInUserProfile ? (
                                        <Settings />
                                    ) : (
                                        <MoreHoriz />
                                    )}
                                </IconButton>
                            </Box>
                        </>
                    )}
                </Box>
                <Box
                    component='ul'
                    marginBottom='20px'
                    display='flex'
                    flexDirection='row'
                    padding='0'
                    marginTop='0'
                    sx={{ listStyleType: 'none' }}
                >
                    <Box
                        component='li'
                        marginRight='40px'
                        display='list-item'
                        fontSize='16px'
                    >
                        <Box
                            component='div'
                            display='block'
                            color='#FFFFFF'
                            fontWeight='400'
                            margin='0'
                            fontSize='16px'
                            lineHeight='24px'
                        >
                            { props.loading ? (
                                <Skeleton sx={{ backgroundColor: '#2C3539' }} animation='wave' width='40px' />
                            ): (
                                <>
                                    <Box
                                        component='span'
                                        color='#FFFFFF'
                                        fontWeight='600'
                                        marginRight='5px'
                                    >
                                        <Box
                                            component='span'
                                        >
                                            { props.postsCount }
                                        </Box>
                                    </Box>
                                    posts
                                </>
                            )}
                        </Box>
                    </Box>
                    <Box
                        component='li'
                        marginRight='40px'
                        display='list-item'
                        fontSize='16px'
                        sx={{ cursor: 'pointer' }}
                    >
                        <Box
                            component='div'
                            display='block'
                            color='#FFFFFF'
                            fontWeight='400'
                            margin='0'
                            fontSize='16px'
                            lineHeight='24px'
                        >
                            { props.loading ? (
                                <Skeleton sx={{ backgroundColor: '#2C3539' }} animation='wave' width='40px' />
                            ): (
                                <>
                                    <Box
                                        component='span'
                                        color='#FFFFFF'
                                        fontWeight='600'
                                        marginRight='5px'
                                    >
                                        <Box
                                            component='span'
                                        >
                                            { props.followersCount }
                                        </Box>
                                    </Box>
                                    followers
                                </>
                            ) }
                        </Box>
                    </Box>
                    <Box
                        component='li'
                        marginRight='40px'
                        display='list-item'
                        fontSize='16px'
                        sx={{ cursor: 'pointer' }}
                    >
                        <Box
                            component='div'
                            display='block'
                            color='#FFFFFF'
                            fontWeight='400'
                            margin='0'
                            fontSize='16px'
                            lineHeight='24px'
                        >
                            { props.loading ? (
                                <Skeleton sx={{ backgroundColor: '#2C3539' }} animation='wave' width='40px' />
                            ): (
                                <>
                                    <Box
                                        component='span'
                                        color='#FFFFFF'
                                        fontWeight='600'
                                        marginRight='5px'
                                    >
                                        <Box
                                            component='span'
                                        >
                                            { props.followingCount }
                                        </Box>
                                    </Box>
                                    following
                                </>
                            ) }
                        </Box>
                    </Box>
                </Box>
                <Box
                    component='div'
                    border='0'
                    boxSizing='border-box'
                    display='block'
                    flexShrink='0'
                    margin='0'
                    padding='0'
                    position='relative'
                    sx={{ verticalAlign: 'baseline' }}
                >
                    <Typography
                        variant='body2'
                        noWrap
                    >
                        { props.loading ? (
                            <Skeleton sx={{ backgroundColor: '#2C3539' }} animation='wave' width='100px' />
                        ) : `${props.firstName} ${props.lastName}` }
                    </Typography>
                    { !props.loading && !props.isLoggedInUserProfile && props.following && (
                        <Box
                            component='div'
                            border='0'
                            display='block'
                            marginTop='14px'
                            padding='0'
                            sx={{ verticalAlign: 'baseline' }}
                        >
                            <Box
                                component='div'
                                display='block'
                                color='#A8A8A8'
                                fontSize='12px'
                                lineHeight='16px'
                                margin='-2px 0 -3px'
                            >
                                { props.mutualFollowersCount > 0 && props.latestMutualFollower ? (
                                    <>
                                        Followed by { props.latestMutualFollower.username }
                                        { props.mutualFollowersCount > 1 && ` + ${props.mutualFollowersCount - 1} more`}
                                    </>
                                ) : 'No mutual followers' }
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    )
}