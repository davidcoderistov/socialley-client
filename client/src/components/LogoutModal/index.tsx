import React from 'react'
import { useLoggedInUser } from '../../hooks/misc'
import { useSnackbar } from 'notistack'
import { useMutation } from '@apollo/client'
import { LOGOUT } from '../../graphql/mutations/auth'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'
import IconButton from '@mui/material/IconButton'
import UserAvatar from '../UserAvatar'
import { Close } from '@mui/icons-material'


interface Props {
    open: boolean
    onCloseModal: () => void
}

export default function LogoutModal (props: Props) {

    const { enqueueSnackbar } = useSnackbar()

    const [loggedInUser, setLoggedInUser] = useLoggedInUser()

    const [logout, { loading }] = useMutation(LOGOUT)

    const handleLogOut = () => {
        logout().then(() => {
            setLoggedInUser(null)
        }).catch(() => {
            enqueueSnackbar('Could not log out at this moment. Please try again later', { variant: 'error' })
        })
        props.onCloseModal()
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
                    firstName={loggedInUser.firstName}
                    lastName={loggedInUser.lastName}
                    photoURL={loggedInUser.avatarURL}
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
                    If you change your mind, you'll have to login again.
                </Typography>
            </Box>
            <LoadingButton
                variant='text'
                fullWidth
                color='error'
                sx={{
                    color: '#ED4956',
                }}
                loading={loading}
                onClick={handleLogOut}
            >
                Log out
            </LoadingButton>
        </Dialog>
    )
}
