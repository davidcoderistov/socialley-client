import React, { useState, useMemo } from 'react'
import Dialog from '@mui/material/Dialog'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { Close, ArrowBack } from '@mui/icons-material'
import MediaUpload from './MediaUpload'
import PostPreview from './PostPreview'


export default function CreatePostModal () {

    const [step, setStep] = useState<number>(0)
    const [file, setFile] = useState<File | null>(null)
    const [isVideo, setIsVideo] = useState<boolean>(false)

    const handleChangeFile = (file: File, isVideo: boolean) => {
        setStep(step + 1)
        setFile(file)
        setIsVideo(isVideo)
    }

    const width: number = useMemo(() => {
        if (step < 1) {
            return 500
        }
        return 700
    }, [step])

    const fileUrl = useMemo(() => {
        if (file) {
            return URL.createObjectURL(file)
        }
        return null
    }, [file])

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
                        <IconButton sx={{ color: '#FFFFFF' }} onClick={() => setStep(step - 1)}>
                            <ArrowBack />
                        </IconButton>
                    ) : (
                        <Box component='div' />
                    )}
                    <Typography color='#FFFFFF'>Create new post</Typography>
                    <IconButton
                        aria-label='close'
                        onClick={() => {}}
                        sx={{ paddingTop: '15px' }}
                    >
                        <Close sx={{ color: '#FFFFFF' }} />
                    </IconButton>
                </Box>
                { step === 0 && (
                    <MediaUpload onChangeFile={handleChangeFile} />
                )}
                { step === 1 && (
                    <PostPreview
                        url={fileUrl ?? ''} />
                )}
            </Box>
        </Dialog>
    )
}