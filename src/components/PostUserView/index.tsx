import React from 'react'
import { useProfileNavigate } from '../../hooks/misc'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import Skeleton from '@mui/material/Skeleton'
import UserAvatar from '../UserAvatar'
import { MoreHoriz } from '@mui/icons-material'
import { getTimeElapsed } from '../../utils'


interface StaticProps {
    post: {
        _id: string
        title: string | null
        createdAt: number
    }
    user: {
        _id: string
        firstName: string
        lastName: string
        username: string
        avatarURL: string | null
        following: boolean
        isFollowingLoading: boolean
    }
    loading?: never
    showAgo?: boolean
    dense?: boolean
    onClickUser: (userId: string) => void
    onFollowUser: (userId: string) => void
    onClickMore: (postId: string, userId: string) => void
}

interface LoadingProps {
    post?: never
    user?: never
    loading: true
    showAgo?: never
    dense?: boolean
    onClickUser?: never
    onFollowUser?: never
    onClickMore?: never
}

type Props = StaticProps | LoadingProps

export default function PostUserView (props: Props) {

    const navigate = useProfileNavigate()

    const ago = !props.loading ? getTimeElapsed(props.post.createdAt) : ''

    const handleClickUser = () => {
        if (!props.loading) {
            navigate(props.user._id)
            props.onClickUser(props.user._id)
        }
    }

    const handleFollowUser = () => {
        if (!props.loading) {
            props.onFollowUser(props.user._id)
        }
    }

    const handleClickMore = () => {
        if (!props.loading) {
            props.onClickMore(props.post._id, props.user._id)
        }
    }

    return (
        <Box
            component='div'
            flex='0 0 auto'
            justifyContent='space-between'
            flexDirection='row'
            alignItems='center'
            alignContent='stretch'
            display='flex'
            boxSizing='border-box'
            position='relative'
        >
            <Box
                component='header'
                alignItems='center'
                boxSizing='border-box'
                display='flex'
                flexDirection='row'
                flexGrow='1'
                flexShrink='1'
                maxWidth='calc(100%-48px)'
                padding={`14px ${props.dense ? 0 : 4}px ${props.dense ? 8 : 14}px ${props.dense ? 0 : 16}px`}
                position='relative'
            >
                { props.loading ? (
                    <Skeleton
                        component='div'
                        animation='wave'
                        variant='circular'
                        width='40px'
                        height='40px'
                        sx={{ backgroundColor: '#262626' }} />
                ) : (
                    <UserAvatar
                        size={40}
                        fontSize={16}
                        firstName={props.user.firstName}
                        lastName={props.user.lastName}
                        photoURL={props.user.avatarURL}
                        clickable
                        onClick={handleClickUser} />
                )}
                <Box
                    component='div'
                    marginLeft='14px'
                    alignItems='flex-start'
                    boxSizing='border-box'
                    display='flex'
                    flexDirection='column'
                    flexGrow='1'
                    flexShrink='1'
                    overflow='hidden'
                    position='relative'
                >
                    <Box
                        component='div'
                        maxWidth='100%'
                        alignItems='baseline'
                        display='flex'
                        flexDirection='row'
                        position='relative'
                    >
                        <Box
                            component='div'
                            display='flex'
                        >
                            <Box
                                component='div'
                                boxSizing='border-box'
                                flexGrow='1'
                                flexShrink='1'
                                fontSize='100%'
                                margin='0'
                                maxWidth='100%'
                                overflow='hidden'
                                padding='2px'
                                position='relative'
                                top='1px'
                                sx={{ verticalAlign: 'baseline' }}
                                display='block'
                            >
                                <Box
                                    component='div'
                                    flex='0 0 auto'
                                    justifyContent='flex-start'
                                    flexDirection='row'
                                    alignItems='center'
                                    alignContent='stretch'
                                    display='flex'
                                    boxSizing='border-box'
                                    position='relative'
                                >
                                    <Box
                                        component='div'
                                        display='block'
                                        color='#FFFFFF'
                                        fontWeight='600'
                                        margin='0'
                                        fontSize='14px'
                                        lineHeight='18px'
                                    >
                                        <Box
                                            component='div'
                                            display='inline'
                                        >
                                            <Box
                                                component='span'
                                                display='inline'
                                                position='relative'
                                                sx={{ cursor: 'pointer', '&:hover': { color: '#A8A8A8' }}}
                                                onClick={handleClickUser}
                                            >
                                                { props.loading ? (
                                                    <Skeleton sx={{ backgroundColor: '#262626' }} animation='wave' width='180px' />
                                                ) : props.user.username }
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box
                            component='div'
                            alignItems='baseline'
                            border='0'
                            boxSizing='border-box'
                            display='flex'
                            flexDirection='row'
                            flexShrink='0'
                            fontSize='100%'
                            margin='0'
                            padding='0'
                            position='relative'
                            top='1px'
                            sx={{ verticalAlign: 'baseline' }}
                        >
                            { props.showAgo && !props.loading && (
                                <>
                                    <Box
                                        component='div'
                                        alignItems='stretch'
                                        border='0'
                                        boxSizing='border-box'
                                        display='flex'
                                        flexDirection='column'
                                        flexShrink='0'
                                        fontSize='100%'
                                        margin='0'
                                        marginRight='2px'
                                        padding='0'
                                        position='relative'
                                        sx={{ verticalAlign: 'baseline' }}
                                    >
                                        <Box
                                            component='span'
                                            marginLeft='4px'
                                            marginRight='2px'
                                            color='#FFFFFF'
                                            display='inline'
                                        >
                                            &middot;
                                        </Box>
                                    </Box>
                                    <Box
                                        component='span'
                                        color='#A8A8A8'
                                        display='inline'
                                        fontSize='12px'
                                    >{ ago }</Box>
                                </>
                            )}
                            <Box
                                component='div'
                                alignItems='stretch'
                                border='0'
                                boxSizing='border-box'
                                display='flex'
                                flexDirection='column'
                                flexShrink='0'
                                fontSize='100%'
                                margin='0'
                                marginRight='2px'
                                padding='0'
                                position='relative'
                                sx={{ verticalAlign: 'baseline' }}
                            >
                                { !props.loading && !props.user.following && (
                                    <Box
                                        component='span'
                                        marginLeft='4px'
                                        marginRight='4px'
                                        color='#FFFFFF'
                                        display='inline'
                                    >
                                        &middot;
                                    </Box>
                                )}
                            </Box>
                            { !props.loading && (
                                <>
                                    { props.user.isFollowingLoading && !props.user.following ? (
                                        <CircularProgress size={14} />
                                    ) : (
                                        <Button
                                            color='primary'
                                            variant='text'
                                            sx={{
                                                textTransform: 'none',
                                                minHeight: 0,
                                                minWidth: 0,
                                                padding: 0,
                                                ...props.user.following && { display: 'none' }
                                            }}
                                            onClick={handleFollowUser}
                                        >Follow</Button>
                                    )}
                                </>
                            )}
                        </Box>
                    </Box>
                    <Box
                        component='div'
                        border='0'
                        bottom='1px'
                        boxSizing='border-box'
                        display='block'
                        fontSize='100%'
                        margin='0'
                        maxWidth='100%'
                        padding='2px'
                        position='relative'
                        sx={{ verticalAlign: 'baseline' }}
                    >
                        <Box
                            component='div'
                            display='block'
                        >
                            <Box
                                component='div'
                                display='block'
                                overflow='hidden'
                                fontWeight='400'
                                margin='0'
                                fontSize='12px'
                                lineHeight='16px'
                                sx={{ textOverflow: 'ellipsis', whiteSpace: 'no-wrap' }}
                            >
                                { props.loading ? (
                                    <Skeleton sx={{ backgroundColor: '#262626' }} animation='wave' width='100px' />
                                ) : props.post.title }
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box
                component='div'
                display='block'
                {...!props.dense && { paddingRight: '8px' }}
            >
                { !props.loading && (
                    <IconButton sx={{ color: '#FFFFFF' }} onClick={handleClickMore}>
                        <MoreHoriz />
                    </IconButton>
                )}
            </Box>
        </Box>
    )
}