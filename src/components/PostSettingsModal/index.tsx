import React from 'react'
import Dialog from '@mui/material/Dialog'
import Box from '@mui/material/Box'
import LoadingButton from '@mui/lab/LoadingButton'
import Button from '@mui/material/Button'


interface Props {
    open: boolean
    showUnfollow: boolean
    isFollowingLoading: boolean
    onUnfollow: () => void
    onGoToPost: () => void
    onCloseModal: () => void
}

export default function PostSettingsModal (props: Props) {

    return (
        <Dialog
            open={props.open}
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: '#262626',
                    borderRadius: '10px',
                    maxWidth: '400px',
                }
            }}
        >
            { props.showUnfollow && (
                <>
                    <LoadingButton
                        variant='text'
                        fullWidth
                        color='error'
                        sx={{
                            color: '#ED4956',
                            '.MuiLoadingButton-loadingIndicator': {
                                color: '#FFFFFF'
                            },
                            textTransform: 'none',
                            paddingY: '10px',
                        }}
                        onClick={props.onUnfollow}
                        loading={props.isFollowingLoading}
                    >
                        Unfollow
                    </LoadingButton>
                    <Box component='div' display='block' borderTop='2px solid #363636' />
                </>
            )}
            <Button
                variant='text'
                fullWidth
                sx={{
                    color: '#FFFFFF',
                    textTransform: 'none',
                    paddingY: '10px',
                }}
                onClick={props.onGoToPost}
            >
                Go to post
            </Button>
            <Box component='div' display='block' borderTop='2px solid #363636' />
            <Button
                variant='text'
                fullWidth
                sx={{
                    color: '#FFFFFF',
                    textTransform: 'none',
                    paddingY: '10px',
                }}
                onClick={props.onCloseModal}
            >
                Cancel
            </Button>
        </Dialog>
    )
}
