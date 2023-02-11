import React, { useState, useMemo } from 'react'
import Dialog from '@mui/material/Dialog'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { Close, ArrowBack } from '@mui/icons-material'
import MediaUpload from './MediaUpload'
import ThumbnailPicker from './ThumbnailPicker'
import PostPreview from './PostPreview'
import { createFileFromBase64 } from '../../utils'


export default function CreatePostModal () {

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
        // TODO: Implement create post
        const postText = postPreviewRef.current?.getPostText() ?? ''
        if (imageFile) {

        } else if (videoFile && coverPhotoFile) {

        }
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
        return 500
    }, [step, videoFile])

    const showThumbnailPicker = useMemo(() => step === 1 && videoFile, [step, videoFile])

    return (
        <Dialog
            open={true}
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: '#262626',
                    borderRadius: '20px',
                    maxWidth: width,
                    paddingBottom: '10px',
                    height: 400
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
                        <Button
                            variant='text'
                            color='primary'
                            sx={{ textTransform: 'none' }}
                            onClick={onShare}
                        >Share</Button>
                    ) : (
                        <IconButton
                            aria-label='close'
                            onClick={() => {}}
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