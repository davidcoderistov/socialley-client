import React from 'react'
import { Box, Dialog, IconButton, Typography } from '@mui/material'
import UserList from './UserList'
import { Close } from '@mui/icons-material'


interface User {
    _id: string
    username: string
    firstName: string
    lastName: string
    avatarURL: string | null
    following: boolean
    isFollowingLoading: boolean
}

interface Props {
    title: string
    open: boolean
    onCloseModal: () => void
    users: User[]
    isInitialLoading: boolean
    isMoreLoading: boolean
    hasMoreUsers: boolean
    onFetchMoreUsers: () => void
    onFollowUser: (userId: string) => void
    onUnfollowUser: (userId: string) => void
    onClickUser: (userId: string) => void
}

export default function FollowableUsersModal (props: Props) {

    return (
        <Dialog
            open={props.open}
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: '#262626',
                    borderRadius: '20px',
                    maxWidth: '400px',
                    height: '480px'
                }
            }}
        >
            <Box
                component='div'
                display='flex'
                flexDirection='row'
                justifyContent='space-between'
                alignItems='center'
            >
                <Box component='div' />
                <Typography color='#FFFFFF'>{ props.title }</Typography>
                <IconButton
                    aria-label='close'
                    onClick={props.onCloseModal}
                    sx={{ paddingTop: '15px' }}
                >
                    <Close sx={{ color: '#FFFFFF' }} />
                </IconButton>
            </Box>
            <UserList
                users={props.users}
                isInitialLoading={props.isInitialLoading}
                isMoreLoading={props.isMoreLoading}
                hasMoreUsers={props.hasMoreUsers}
                onFetchMoreUsers={props.onFetchMoreUsers}
                onFollowUser={props.onFollowUser}
                onUnfollowUser={props.onUnfollowUser}
                onClickUser={props.onClickUser} />
        </Dialog>
    )
}