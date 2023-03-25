import React, { useState, useMemo } from 'react'
import { useApolloClient, useMutation } from '@apollo/client'
import { useLoggedInUser } from '../../hooks/misc'
import { useSnackbar } from 'notistack'
import { GET_FOLLOWED_USERS_POSTS, GET_POSTS_FOR_USER } from '../../graphql/queries/posts'
import { GetFollowedUsersPostsQueryType, GetPostsForUserQueryType } from '../../graphql/types/queries/posts'
import { CREATE_POST } from '../../graphql/mutations/posts'
import { CreatePostMutationType } from '../../graphql/types/mutations/posts'
import Dialog from '@mui/material/Dialog'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import IconButton from '@mui/material/IconButton'
import { Close, ArrowBack } from '@mui/icons-material'
import MediaUpload from './MediaUpload'
import ThumbnailPicker from './ThumbnailPicker'
import PostPreview from './PostPreview'
import { createFileFromBase64 } from '../../utils'
import { addFollowedUserPost } from '../../apollo/mutations/posts/followedUsersPosts'
import { addPostForUser } from '../../apollo/mutations/posts/postsForUser'


interface CreatePostModalProps {
    open: boolean
    onClose: () => void
}

export default function CreatePostModal (props: CreatePostModalProps) {

    const client = useApolloClient()

    const [loggedInUser] = useLoggedInUser()

    const { enqueueSnackbar } = useSnackbar()

    const [createPost, { loading }] = useMutation<CreatePostMutationType>(CREATE_POST)

    const [step, setStep] = useState<number>(0)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const [coverPhotoUrl, setCoverPhotoUrl] = useState<string | null>(null)
    const [coverPhotoFile, setCoverPhotoFile] = useState<File | null>(null)
    const [nextDisabled, setNextDisabled] = useState(true)
    const [thumbnailPickerKey, setThumbnailPickerKey] = useState(1111)
    const [postPreviewKey, setPostPreviewKey] = useState(9999)

    const thumbnailPickerRef = React.createRef<{ getSelectedCoverPhotoUrl: () => string | null }>()
    const postPreviewRef = React.createRef<{ getPostText: () => string }>()

    const handleUploadFile = (file: File, isVideo: boolean) => {
        if (isVideo) {
            setVideoFile(file)
        } else {
            setImageFile(file)
        }
        setStep(step + 1)
    }

    const onGoBack = () => {
        const currStep = step - 1
        if (currStep <= 0) {
            setImageFile(null)
            setVideoFile(null)
            setCoverPhotoUrl(null)
            setCoverPhotoFile(null)
            setNextDisabled(true)
            setThumbnailPickerKey(thumbnailPickerKey + 1)
            setPostPreviewKey(postPreviewKey + 1)
        }
        setStep(currStep)
    }

    const onClickNext = () => {
        const coverPhotoUrl = thumbnailPickerRef?.current?.getSelectedCoverPhotoUrl()
        if (coverPhotoUrl) {
            setCoverPhotoUrl(coverPhotoUrl)
            setCoverPhotoFile(createFileFromBase64(coverPhotoUrl, 'Cover photo'))
        }
        setStep(step + 1)
    }

    const onShare = () => {
        const postText = postPreviewRef.current?.getPostText() ?? ''
        let photo = null, video = null
        if (imageFile) {
            photo = imageFile
        } else if (videoFile && coverPhotoFile) {
            photo = coverPhotoFile
            video = videoFile
        }
        createPost({
            variables: {
                post: {
                    title: postText,
                    photo,
                    video,
                }
            },
            context: {
                hasUpload: true,
            }
        }).then(data => {
            const postDetails = data.data?.createPost
            if (postDetails) {
                client.cache.updateQuery(
                    { query: GET_FOLLOWED_USERS_POSTS },
                    (followedUsersPosts: GetFollowedUsersPostsQueryType | null) => {
                        if (followedUsersPosts) {
                            return addFollowedUserPost({
                                followedUsersPosts,
                                postDetails,
                            }).followedUsersPosts
                        }
                    }
                )
                client.cache.updateQuery(
                    { query: GET_POSTS_FOR_USER, variables: { userId: loggedInUser._id }},
                    (postsForUser: GetPostsForUserQueryType | null) => {
                        if (postsForUser) {
                            return addPostForUser({
                                postsForUser,
                                post: postDetails.post,
                            })
                        }
                    }
                )
                enqueueSnackbar('Post shared', { variant: 'success' })
                props.onClose()
            }
        }).catch(err => {
            enqueueSnackbar('Post could not be shared', { variant: 'error' })
            console.log(err)
        })
    }

    const onUploadCoverPhoto = (file: File) => {
        setCoverPhotoUrl(URL.createObjectURL(file))
        setCoverPhotoFile(file)
        setStep(step + 1)
    }

    const onCoverPhotosGenerated = () => {
        setNextDisabled(false)
    }

    const width: number = useMemo(() => {
        if (videoFile && step === 1) {
            return 650
        }
        return 600
    }, [step, videoFile])

    const showThumbnailPicker = useMemo(() => step === 1 && videoFile, [step, videoFile])

    return (
        <Dialog
            open={props.open}
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: '#262626',
                    borderRadius: '20px',
                    maxWidth: width,
                    paddingBottom: '10px',
                    height: videoFile && step === 1 ? 400 : 500
                }
            }}
        >
            <Box
                component='div'
                minHeight='0'
                minWidth='0'
                height='100%'
                width='100%'
                overflow='hidden'
                display='flex'
                flexDirection='column'
                justifyContent='flex-start'
                alignItems='stretch'
                alignContent='stretch'
                boxSizing='border-box'
                position='relative'
            >
                <Box
                    component='div'
                    display='flex'
                    flexDirection='row'
                    justifyContent='space-between'
                    alignItems='center'
                >
                    { step > 0 ? (
                        <IconButton sx={{ color: '#FFFFFF' }} onClick={onGoBack}>
                            <ArrowBack />
                        </IconButton>
                    ) : (
                        <Box component='div' />
                    )}
                    <Typography color='#FFFFFF'>
                        { step === 1 && videoFile ? 'Choose cover photo' : 'Create new post' }
                    </Typography>
                    { step > 0 ? step === 1 && videoFile ? (
                        <Button
                            variant='text'
                            color='primary'
                            sx={{ textTransform: 'none' }}
                            disabled={nextDisabled}
                            onClick={onClickNext}
                        >Next</Button>
                    ) : (
                        <LoadingButton
                            variant='text'
                            color='primary'
                            sx={{ textTransform: 'none', '.MuiLoadingButton-loadingIndicator': { color: '#FFFFFF' }}}
                            loading={loading}
                            onClick={onShare}
                        >Share</LoadingButton>
                    ) : (
                        <IconButton
                            aria-label='close'
                            onClick={props.onClose}
                            sx={{ paddingTop: '15px' }}
                        >
                            <Close sx={{ color: '#FFFFFF' }} />
                        </IconButton>
                    )}
                </Box>
                { step === 0 && (
                    <MediaUpload onChangeFile={handleUploadFile} />
                )}
                <ThumbnailPicker
                    key={thumbnailPickerKey}
                    ref={thumbnailPickerRef}
                    file={videoFile}
                    onCoverPhotosGenerated={onCoverPhotosGenerated}
                    onUploadFile={onUploadCoverPhoto}
                    containerProps={showThumbnailPicker ? {} : { display: 'none' }} />
                <PostPreview
                    key={postPreviewKey}
                    ref={postPreviewRef}
                    url={videoFile ? coverPhotoUrl : imageFile ? URL.createObjectURL(imageFile) : null}
                    containerProps={step > 0 && !showThumbnailPicker ? {} : { display: 'none' }} />
            </Box>
        </Dialog>
    )
}