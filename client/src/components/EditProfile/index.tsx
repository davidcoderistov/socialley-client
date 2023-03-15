import React, { useState } from 'react'
import { useSnackbar } from 'notistack'
import { useMutation, ApolloError } from '@apollo/client'
import { CHANGE_PROFILE_PHOTO, EDIT_USER } from '../../graphql/mutations/auth'
import { ChangeProfilePhotoMutationType, EditUserMutationType } from '../../graphql/types/mutations/auth'
import { useLoggedInUser } from '../../hooks/misc'
import { useForm, FieldPath } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import LoadingButton from '@mui/lab/LoadingButton'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import UserAvatar from '../UserAvatar'
import FileUpload from '../FileUpload'
import LoadingIconButton from '../LoadingIconButton'
import { Check, Close } from '@mui/icons-material'
import AvatarEditor from 'react-avatar-editor'
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

interface Editor {
    getImage: () => HTMLCanvasElement
}

const validationSchema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    username: yup.string().required('Username is required'),
    email: yup.string().required('Email address is required').email('Invalid email address'),
})

export default function EditProfile () {

    const [loggedInUser, setLoggedInUser] = useLoggedInUser()

    const [uploadFile, setUploadFile] = useState<File | null>(null)
    const [editor, setEditor] = useState<Editor | null>(null)
    const [isSavingProfilePhoto, setIsSavingProfilePhoto] = useState(false)

    const [changeProfilePhoto] = useMutation<ChangeProfilePhotoMutationType>(CHANGE_PROFILE_PHOTO)
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

    const handleChangeProfilePhoto = (file: File) => {
        setUploadFile(file)
    }

    const handleSaveProfilePhoto = () => {
        if (editor && uploadFile) {
            setIsSavingProfilePhoto(true)

            const delegate = new Promise((resolve) => {
                resolve(undefined)
            })

            delegate.then(() => {
                const canvas = editor.getImage().toDataURL()
                fetch(canvas)
                    .then(res => res.blob())
                    .then(blob => {
                        const photo = new File([blob], uploadFile.name, { type: blob.type })
                        changeProfilePhoto({
                            variables: {
                                photo
                            },
                            context: {
                                hasUpload: true
                            }
                        }).then(data => {
                            const user = data.data?.changeProfilePhoto
                            if (user) {
                                setLoggedInUser({
                                    ...loggedInUser,
                                    ...user.user,
                                    accessToken: user.accessToken,
                                })
                                enqueueSnackbar('You have changed your profile photo successfully', { variant: 'success' })
                                setUploadFile(null)
                                setEditor(null)
                            } else {
                                enqueueSnackbar('Profile photo could not be changed. Please try again later', { variant: 'error' })
                            }
                        }).catch(() => {
                            enqueueSnackbar('Profile photo could not be changed. Please try again later', { variant: 'error' })
                        }).finally(() => setIsSavingProfilePhoto(false))
                    }).catch(() => {
                    setIsSavingProfilePhoto(false)
                    enqueueSnackbar('Profile photo could not be changed. Please try again later', { variant: 'error' })
                })
            })
        } else {
            enqueueSnackbar('Profile photo could not be changed. Please try again later', { variant: 'error' })
        }
    }


    const handleDiscardProfilePhoto = () => {
        setUploadFile(null)
    }

    const setEditorRef = (editor: Editor | null) => {
        setEditor(editor)
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
                <Grid container spacing={2} sx={{ mb: 2 }}>
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
                                size={56}
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
                                <Button
                                    variant='text'
                                    color='primary'
                                    component='label'
                                    sx={{ textTransform: 'none', padding: 0, '&:hover': { color: '#FFFFFF' }}}
                                >
                                    Change profile photo
                                    <FileUpload
                                        mimeTypes={['image/jpeg', 'image/png']}
                                        onChangeFile={handleChangeProfilePhoto} />
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
                { uploadFile && (
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sx={{ '&.MuiGrid-item': { paddingTop: 0 } }}>
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
                                    alignItems='center'
                                    columnGap='5px'
                                >
                                    <LoadingIconButton
                                        color='#4caf50'
                                        loading={isSavingProfilePhoto}
                                        iconComponent={<Check />}
                                        onClick={handleSaveProfilePhoto} />
                                    <IconButton sx={{ padding: 0 }} onClick={handleDiscardProfilePhoto}>
                                        <Close sx={{ color: '#ED4956' }}/>
                                    </IconButton>
                                </Box>
                                <AvatarEditor
                                    ref={setEditorRef}
                                    image={uploadFile}
                                    width={150}
                                    height={150}
                                    border={5}
                                    borderRadius={120}
                                    color={[255, 255, 255, 0.4]}
                                    scale={1.2}
                                    rotate={0}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                )}
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