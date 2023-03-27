import React, { useState } from 'react'
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
import LoadingButton from '@mui/lab/LoadingButton'
import IconButton from '@mui/material/IconButton'
import { Close, ArrowBack } from '@mui/icons-material'
import MediaUpload from './MediaUpload'
import PostPreview from './PostPreview'
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
    const [thumbnailPickerKey, setThumbnailPickerKey] = useState(1111)
    const [postPreviewKey, setPostPreviewKey] = useState(9999)

    const postPreviewRef = React.createRef<{ getPostText: () => string }>()

    const handleUploadFile = (file: File) => {
        setImageFile(file)
        setStep(step + 1)
    }

    const onGoBack = () => {
        const currStep = step - 1
        if (currStep <= 0) {
            setImageFile(null)
            setThumbnailPickerKey(thumbnailPickerKey + 1)
            setPostPreviewKey(postPreviewKey + 1)
        }
        setStep(currStep)
    }

    const onShare = () => {
        const postText = postPreviewRef.current?.getPostText() ?? ''
        let photo = null
        if (imageFile) {
            photo = imageFile
        }
        createPost({
            variables: {
                post: {
                    title: postText,
                    photo,
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

    return (
        <Dialog
            open={props.open}
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: '#262626',
                    borderRadius: '20px',
                    maxWidth: 600,
                    paddingBottom: '10px',
                    height: 500
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
                        Create new post
                    </Typography>
                    { step > 0 ? (
                        <LoadingButton
                            variant='text'
                            color='primary'
                            sx={{ textTransform: 'none', '.MuiLoadingButton-loadingIndicator': { color: '#1976d2' }}}
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
                { step === 1 && (
                    <PostPreview
                        key={postPreviewKey}
                        ref={postPreviewRef}
                        url={imageFile ? URL.createObjectURL(imageFile) : null} />
                )}
            </Box>
        </Dialog>
    )
}