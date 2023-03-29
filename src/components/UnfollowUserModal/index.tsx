import React from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import UserAvatar from '../UserAvatar'
import { Close } from '@mui/icons-material'


interface Props {
    open: boolean
    user: {
        _id: string
        firstName: string
        lastName: string
        username: string
        avatarURL: string | null
    }
    onUnfollowUser: (userId: string) => void
    onCloseModal: () => void
}

export default function UnfollowUserModal (props: Props) {

    const handleUnfollowUser = () => props.onUnfollowUser(props.user._id)

    const handleClickModal = (event: React.MouseEvent) => {
        event.stopPropagation()
    }

    return (
        <Dialog
            open={props.open}
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: '#262626',
                    borderRadius: '20px',
                    maxWidth: '400px',
                    paddingBottom: '10px',
                }
            }}
            onClick={handleClickModal}
        >
            <Box
                component='div'
                display='flex'
                flexDirection='row'
                justifyContent='flex-end'
                alignItems='center'
            >
                <IconButton
                    aria-label='close'
                    onClick={props.onCloseModal}
                    sx={{ paddingTop: '15px' }}
                >
                    <Close sx={{ color: '#FFFFFF' }} />
                </IconButton>
            </Box>
            <Box
                component='div'
                display='flex'
                flexDirection='column'
                justifyContent='center'
                alignItems='center'
                paddingTop='10px'
                paddingBottom='30px'
            >
                <UserAvatar
                    firstName={props.user.firstName}
                    lastName={props.user.lastName}
                    photoURL={props.user.avatarURL}
                    size={80}
                    backgroundColor='#616161'
                />
            </Box>
            <Box
                component='div'
                display='flex'
                flexDirection='column'
                justifyContent='center'
                alignItems='center'
                paddingBottom='30px'
            >
                <Typography
                    variant='body2'
                    sx={{
                        color: '#FFFFFF',
                        textAlign: 'center',
                    }}
                >
                    If you change your mind, you'll have to request to follow <b>{ props.user.username }</b> again.
                </Typography>
            </Box>
            <Button
                variant='text'
                fullWidth
                color='error'
                sx={{
                    color: '#ED4956',
                }}
                onClick={handleUnfollowUser}
            >
                Unfollow
            </Button>
        </Dialog>
    )
}
