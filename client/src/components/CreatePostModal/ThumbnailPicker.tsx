import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import UploadFile from '../UploadFile'
import MediaDisplay from '../MediaDisplay'
import { default as _ReactPlayer } from 'react-player/lazy'
import { ReactPlayerProps } from 'react-player/types/lib'
import { generateVideoThumbnails } from '@rajesh896/video-thumbnails-generator'
import _range from 'lodash/range'

const ReactPlayer = _ReactPlayer as unknown as React.FC<ReactPlayerProps>


interface MediaItem {
    _id: string
    url: string
    selected: boolean
}

interface Props {
    file: File
    onUploadFile: (file: File, isVideo: boolean) => void
    onGenerateCoverPhotos: () => void
}

export default function ThumbnailPicker (props: Props) {

    const [coverPhotos, setCoverPhotos] = useState<MediaItem[]>(
        _range(6).map(index => ({ _id: index.toString(), url: '', selected: false }))
    )

    useEffect(() => {
        generateVideoThumbnails(props.file, 6, 'base64').then(imgUrls => {
            setCoverPhotos(imgUrls.map((url, index) => ({
                _id: index.toString(),
                url,
                selected: index === 0,
            })))
            props.onGenerateCoverPhotos()
        })
    }, [props.file])

    const handleClickCoverPhoto = (_id: string) => {
        setCoverPhotos(coverPhotos.map(coverPhoto => ({
            ...coverPhoto,
            selected: coverPhoto._id === _id
        })))
    }

    return (
        <Box
            component='div'
            display='flex'
            flex='1 1 auto'
            margin='15px'
        >
            <Box
                component='div'
                display='flex'
                justifyContent='center'
                height='100%'
                alignItems='flex-start'
                width='450px'
            >
                <Box
                    component='div'
                    alignItems='center'
                    border='0'
                    boxSizing='border-box'
                    display='flex'
                    flexDirection='column'
                    flexShrink='0'
                    height='100%'
                    justifyContent='center'
                    margin='0'
                    padding='0'
                    position='relative'
                    width='100%'
                    sx={{ verticalAlign: 'baseline' }}
                >
                    <Box
                        component='div'
                        alignItems='center'
                        bgcolor='#121212'
                        border='0'
                        boxSizing='border-box'
                        display='flex'
                        flexDirection='column'
                        flexShrink='0'
                        height='100%'
                        justifyContent='center'
                        margin='0'
                        padding='0'
                        position='relative'
                        width='100%'
                        sx={{ verticalAlign: 'baseline' }}
                    >
                        <Box
                            component='div'
                            alignItems='center'
                            display='flex'
                            flexDirection='column'
                            height='100%'
                            width='100%'
                        >
                            <Box
                                component='div'
                                width='100%'
                                height='100%'
                                alignItems='stretch'
                                border='0'
                                boxSizing='border-box'
                                display='flex'
                                flexDirection='column'
                                flexShrink='0'
                                margin='auto'
                                padding='0'
                                position='relative'
                                sx={{ verticalAlign: 'baseline' }}
                            >
                                <ReactPlayer
                                    width='100%'
                                    height='100%'
                                    url='https://www.youtube.com/watch?v=4WT5cMFySHg'
                                    playing={false} />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box
                component='div'
                display='flex'
                position='relative'
                boxSizing='border-box'
                borderLeft='1px solid #363636'
                width='100%'
            >
                <Box
                    component='div'
                    flex='1 1 auto'
                    minHeight='0'
                    minWidth='0'
                    justifyContent='flex-start'
                    flexDirection='column'
                    alignItems='stretch'
                    alignContent='stretch'
                    display='flex'
                    boxSizing='border-box'
                    position='relative'
                >
                    <Box
                        component='div'
                        display='block'
                        height='100%'
                        overflow='hidden'
                    >
                        <Box
                            component='div'
                            alignItems='stretch'
                            border='0'
                            boxSizing='border-box'
                            display='flex'
                            flexDirection='column'
                            margin='0'
                            padding='0'
                            position='relative'
                            height='100%'
                            sx={{ verticalAlign: 'baseline' }}
                        >
                            <Box
                                component='div'
                                display='flex'
                                margin='0 16px 8px'
                                flex='0 0 auto'
                                justifyContent='space-between'
                                flexDirection='row'
                                alignItems='center'
                                alignContent='stretch'
                                boxSizing='border-box'
                                position='relative'
                                columnGap='5px'
                            >
                                <Typography color='#FFFFFF'>Cover photo</Typography>
                                <Button
                                    variant='text'
                                    color='primary'
                                    component='label'
                                    sx={{ textTransform: 'none', '&:hover': { color: '#FFFFFF', bgcolor: '#262626' } }}
                                >
                                    Select from computer
                                    <UploadFile mimeTypes={['image/jpeg', 'image/png']} onChangeFile={props.onUploadFile} />
                                </Button>
                            </Box>
                            <Box
                                component='div'
                                margin='16px'
                                flex='1 1 auto'
                                minHeight='0'
                                minWidth='0'
                                justifyContent='flex-start'
                                flexDirection='column'
                                alignItems='stretch'
                                alignContent='stretch'
                                display='flex'
                                boxSizing='border-box'
                                position='relative'
                                height='100%'
                            >
                                {coverPhotos.length > 0 ? (
                                    <MediaDisplay
                                        items={coverPhotos}
                                        minHeight={100}
                                        backgroundColor='#000000'
                                        tile={false}
                                        onClick={handleClickCoverPhoto} />
                                ) : (
                                    <Box
                                        component='div'
                                        height='100%'
                                        width='100%'
                                        display='flex'
                                        flexDirection='column'
                                        justifyContent='center'
                                        alignItems='center'
                                        color='#A8A8A8'
                                    >
                                        <Typography>
                                            No cover photos could be generated
                                        </Typography>
                                        <Typography>
                                            Please upload your own
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}