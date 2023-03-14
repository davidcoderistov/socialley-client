import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfileNavigate } from '../../hooks/misc'
import MuiDrawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import { ArrowBackIos } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import AllNotifications from './AllNotifications'
import PostLikeNotifications from './PostLikeNotifications'
import PostCommentNotifications from './PostCommentNotifications'
import FollowNotifications from './FollowNotifications'


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: 390,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: 0,
            }),
        },
    }),
)

interface SearchDrawerProps {
    open: boolean
}

export default function NotificationsDrawer (props: SearchDrawerProps) {

    const navigate = useNavigate()
    const profileNavigate = useProfileNavigate()

    const [step, setStep] = useState<number | null>(null)

    const handleClickDrawer = (event: React.MouseEvent) => {
        event.stopPropagation()
    }

    const handleClickPostLikeNotification = (postId: string) => {
        navigate(`/profile/${postId}`)
    }

    const handleClickPostCommentNotification = (postId: string) => {
        navigate(`/profile/${postId}`)
    }

    const handleClickFollowNotification = (userId: string) => {
        profileNavigate(userId)
    }

    const handleClickSeeAllLikes = () => {
        setStep(1)
    }

    const handleClickSeeAllComments = () => {
        setStep(2)
    }

    const handleClickSeeAllFollowings = () => {
        setStep(3)
    }

    const handleClickBack = () => {
        setStep(null)
    }

    useEffect(() => {
        if (!props.open && step) {
            setStep(null)
        }
    }, [props.open, step])

    return (
        <Drawer
            variant='permanent'
            anchor='left'
            open={props.open}
            PaperProps={{ sx: { backgroundColor: 'black', borderRight: '1px solid #232323' }}}
            onClick={handleClickDrawer}
        >
            <Toolbar
                sx={{
                    pt: [4],
                    pb: [3],
                }}
            >
                { !!step && (
                    <IconButton onClick={handleClickBack}>
                        <ArrowBackIos sx={{ color: '#FFFFFF' }}/>
                    </IconButton>
                )}
                <Typography noWrap variant='h5' color='#FFFFFF' sx={{ fontFamily: 'Bosca' }}>
                    { !step && 'Notifications' }
                    { step === 1 && 'Recent Likes' }
                    { step === 2 && 'Recent Comments' }
                    { step === 3 && 'Recent Followings' }
                </Typography>
            </Toolbar>
            <Divider />
            <Box
                component='div'
                borderTop='1px solid #262626'
            />
            <Box
                component='div'
                paddingY='8px'
                display='flex'
                flexDirection='column'
                flexGrow='1'
                flexShrink='1'
                minHeight='0'
                position='relative'
                sx={{ overflowX: 'hidden', overflowY: 'auto' }}
            >
                <AllNotifications
                    shouldSkipQuery={!props.open}
                    visible={!step}
                    onClickPostLikeNotification={handleClickPostLikeNotification}
                    onClickPostCommentNotification={handleClickPostCommentNotification}
                    onClickFollowNotification={handleClickFollowNotification}
                    onClickSeeAllLikes={handleClickSeeAllLikes}
                    onClickSeeAllComments={handleClickSeeAllComments}
                    onClickSeeAllFollowings={handleClickSeeAllFollowings} />
                <PostLikeNotifications
                    visible={step === 1}
                    onClick={handleClickPostLikeNotification} />
                <PostCommentNotifications
                    visible={step === 2}
                    onClick={handleClickPostCommentNotification} />
                <FollowNotifications
                    visible={step === 3}
                    onClick={handleClickFollowNotification} />
            </Box>
        </Drawer>
    )
}