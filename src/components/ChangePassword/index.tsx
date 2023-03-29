import React from 'react'
import { useSnackbar } from 'notistack'
import { useMutation, ApolloError } from '@apollo/client'
import { CHANGE_PASSWORD } from '../../graphql/mutations/auth'
import { ChangePasswordMutationType } from '../../graphql/types/mutations/auth'
import { useLoggedInUser } from '../../hooks/misc'
import { useForm, FieldPath } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import LoadingButton from '@mui/lab/LoadingButton'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import UserAvatar from '../UserAvatar'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import PasswordInput from '../PasswordInput'
import { getValidationError } from '../../utils'


const darkTheme = createTheme({
    palette: {
        mode: 'dark'
    },
});

interface FormData {
    oldPassword: string
    newPassword: string
    confirmNewPassword: string
}

const validationSchema = yup.object().shape({
    oldPassword: yup.string()
        .required('Old password is required')
        .min(8, 'Old password must be at least 8 characters'),
    newPassword: yup.string()
        .required('New password is required')
        .min(8, 'New password must be at least 8 characters'),
    confirmNewPassword: yup.string()
        .required('Confirm new password is required')
        .min(8, 'Confirm new password must be at least 8 characters')
        .oneOf([yup.ref('newPassword'), null], 'Passwords do not match')
})

export default function ChangePassword () {

    const [loggedInUser, setLoggedInUser] = useLoggedInUser()

    const [changePassword, { loading }] = useMutation<ChangePasswordMutationType>(CHANGE_PASSWORD)

    const { enqueueSnackbar } = useSnackbar()

    const { register, handleSubmit, formState: { errors, isDirty }, setError, reset } = useForm<FormData>({
        resolver: yupResolver(validationSchema),
    })

    const setServerError = (name: FieldPath<FormData>, message: string) => {
        setError(name, { message })
    }

    const handleChangePassword = (data: FormData) => {
        changePassword({
            variables: {
                changePassword: {
                    username: loggedInUser.username,
                    ...data,
                }
            }
        }).then((data) => {
            const editedUser = data.data?.changePassword
            if (editedUser) {
                setLoggedInUser({
                    ...loggedInUser,
                    ...editedUser.user,
                    accessToken: editedUser.accessToken,
                })
                enqueueSnackbar('You have changed your password successfully', { variant: 'success' })
                reset()
            } else {
                enqueueSnackbar('Password could not be changed. Please try again later', { variant: 'error' })
            }
        }).catch((err: ApolloError) => {
            const validationError = getValidationError(err)
            if (validationError?.oldPassword) {
                return setServerError('oldPassword', validationError.oldPassword)
            } else if (validationError?.newPassword) {
                return setServerError('newPassword', validationError.newPassword)
            } else if (validationError?.confirmNewPassword) {
                return setServerError('confirmNewPassword', validationError.confirmNewPassword)
            } else {
                enqueueSnackbar('Password could not be changed. Please try again later', { variant: 'error' })
            }
        })
    }

    return (
        <Container component='main' maxWidth='sm'>
            <CssBaseline />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 4,
                }}
            >
                <Box component='form' onSubmit={handleSubmit(handleChangePassword)} noValidate sx={{ mt: 1 }}>
                    <ThemeProvider theme={darkTheme}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Box
                                    component='div'
                                    display='flex'
                                    flexDirection='row'
                                    justifyContent='flex-start'
                                    alignItems='center'
                                    columnGap='10px'
                                >
                                    <UserAvatar
                                        size={38}
                                        firstName={loggedInUser.firstName}
                                        lastName={loggedInUser.lastName}
                                        photoURL={loggedInUser.avatarURL} />
                                    <Box
                                        component='div'
                                        display='flex'
                                        flexDirection='column'
                                        justifyContent='center'
                                        alignItems='flex-start'
                                    >
                                        <Typography
                                            variant='body1'
                                            color='#FFFFFF'
                                        >
                                            { loggedInUser.username }
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <PasswordInput
                                    id='oldPassword'
                                    label='Old Password'
                                    {...register('oldPassword')}
                                    error={Boolean(errors.oldPassword)}
                                    errorMessage={errors.oldPassword?.message as string ?? ''} />
                            </Grid>
                            <Grid item xs={12}>
                                <PasswordInput
                                    id='newPassword'
                                    label='New Password'
                                    {...register('newPassword')}
                                    error={Boolean(errors.newPassword)}
                                    errorMessage={errors.newPassword?.message as string ?? ''} />
                            </Grid>
                            <Grid item xs={12}>
                                <PasswordInput
                                    id='confirmNewPassword'
                                    label='Confirm New Password'
                                    {...register('confirmNewPassword')}
                                    error={Boolean(errors.confirmNewPassword)}
                                    errorMessage={errors.confirmNewPassword?.message as string ?? ''} />
                            </Grid>
                        </Grid>
                    </ThemeProvider>
                    <LoadingButton
                        type='submit'
                        variant='contained'
                        loading={loading}
                        disabled={!isDirty}
                        sx={{
                            mt: 2,
                            mb: 2,
                            textTransform: 'none',
                            '&.Mui-disabled': { color: '#A8A8A8', backgroundColor: '#0069AD' },
                            '&.MuiLoadingButton-loading': { color: '#1976D2', backgroundColor: '#1976D2' },
                            '.MuiLoadingButton-loadingIndicator': { color: '#FFFFFF' }
                        }}
                    >
                        Submit
                    </LoadingButton>
                </Box>
            </Box>
        </Container>
    )
}