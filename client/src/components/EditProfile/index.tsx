import React from 'react'
import { useSnackbar } from 'notistack'
import { useMutation, ApolloError } from '@apollo/client'
import { EDIT_USER } from '../../graphql/mutations/auth'
import { EditUserMutationType } from '../../graphql/types/mutations/auth'
import { useLoggedInUser } from '../../hooks/misc'
import { useForm, FieldPath } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import LoadingButton from '@mui/lab/LoadingButton'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { getValidationError } from '../../utils'


const darkTheme = createTheme({
    palette: {
        mode: 'dark'
    },
});

interface FormData {
    firstName: string
    lastName: string
    username: string
    email: string
}

const validationSchema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    username: yup.string().required('Username is required'),
    email: yup.string().required('Email address is required').email('Invalid email address'),
})

export default function EditProfile () {

    const [loggedInUser, setLoggedInUser] = useLoggedInUser()

    const [editUser, { loading }] = useMutation<EditUserMutationType>(EDIT_USER)

    const { enqueueSnackbar } = useSnackbar()

    const { register, handleSubmit, formState: { errors, isDirty }, setError } = useForm<FormData>({
        resolver: yupResolver(validationSchema),
    })

    const setServerError = (name: FieldPath<FormData>, message: string) => {
        setError(name, { message })
    }

    const handleEditUser = (data: FormData) => {
        editUser({
            variables: {
                user: {
                    _id: loggedInUser._id,
                    ...data,
                }
            }
        }).then((data) => {
            const editedUser = data.data?.editUser
            if (editedUser) {
                setLoggedInUser({
                    ...loggedInUser,
                    ...editedUser.user,
                    accessToken: editedUser.accessToken,
                })
                enqueueSnackbar('You have edited your profile successfully', { variant: 'success' })
            } else {
                enqueueSnackbar('Profile could not be edited. Please try again later', { variant: 'error' })
            }
        }).catch((err: ApolloError) => {
            const validationError = getValidationError(err)
            if (validationError?.firstName) {
                return setServerError('firstName', validationError.firstName)
            } else if (validationError?.lastName) {
                return setServerError('lastName', validationError.lastName)
            } else if (validationError?.username) {
                return setServerError('username', validationError.username)
            } else if (validationError?.email) {
                return setServerError('email', validationError.email)
            } else {
                enqueueSnackbar('Profile could not be edited. Please try again later', { variant: 'error' })
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
                <Box component='form' onSubmit={handleSubmit(handleEditUser)} noValidate sx={{ mt: 1 }}>
                    <ThemeProvider theme={darkTheme}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    {...register('firstName')}
                                    error={Boolean(errors.firstName)}
                                    helperText={errors.firstName?.message as string ?? ''}
                                    defaultValue={loggedInUser.firstName}
                                    required
                                    fullWidth
                                    id='firstName'
                                    label='First Name'
                                    autoComplete='firstName' />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    {...register('lastName')}
                                    error={Boolean(errors.lastName)}
                                    helperText={errors.lastName?.message as string ?? ''}
                                    defaultValue={loggedInUser.lastName}
                                    required
                                    fullWidth
                                    id='lastName'
                                    label='Last Name'
                                    autoComplete='lastName' />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    {...register('username')}
                                    error={Boolean(errors.username)}
                                    helperText={errors.username?.message as string ?? ''}
                                    defaultValue={loggedInUser.username}
                                    required
                                    fullWidth
                                    id='username'
                                    label='Username'
                                    autoComplete='username' />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    {...register('email')}
                                    error={Boolean(errors.email)}
                                    helperText={errors.email?.message as string ?? ''}
                                    defaultValue={loggedInUser.email}
                                    required
                                    fullWidth
                                    id='email'
                                    label='Email Address'
                                    autoComplete='email' />
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