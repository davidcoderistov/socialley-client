import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { SaveAlt } from '@mui/icons-material'
import FileUpload from '../FileUpload'


interface Props {
    onChangeFile: (file: File, isVideo: boolean) => void
}

export default function MediaUpload (props: Props) {

    return (
        <Box
            component='div'
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            height='100%'
            width='100%'
        >
            <SaveAlt sx={{ fontSize: 60, color: '#FFFFFF' }}/>
            <Typography
                variant='h6'
                color='#FFFFFF'
                marginBottom='20px'
            >Upload photos and videos here</Typography>
            <Button
                variant='contained'
                color='primary'
                component='label'
                sx={{ textTransform: 'none' }}
            >
                Select from computer
                <FileUpload mimeTypes={['image/jpeg', 'image/png', 'video/mp4']} onChangeFile={props.onChangeFile} />
            </Button>
        </Box>
    )
}