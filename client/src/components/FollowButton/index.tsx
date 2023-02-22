import React from 'react'
import LoadingButton from '@mui/lab/LoadingButton'


interface FollowButtonProps {
    contained: boolean
    loading: boolean
    onClick: () => void
}

export default function FollowButton (props: FollowButtonProps) {

    return (
        <LoadingButton
            variant={props.contained ? 'contained' : 'text'}
            sx={props.contained ? {
                textTransform: 'none',
                borderRadius: '10px',
                minWidth: '80px',
                backgroundColor: '#0095F6',
                '&:hover': {
                    backgroundColor: '#1877F2',
                },
                '&.MuiLoadingButton-loading': {
                    backgroundColor: '#0095F6',
                },
                '.MuiLoadingButton-loadingIndicator': {
                    color: '#FFFFFF',
                }
            } : {
                textTransform: 'none',
                color: '#0095F6',
                '&:hover': {
                    color: '#FFFFFF',
                },
                '.MuiLoadingButton-loadingIndicator': {
                    color: '#0095F6',
                }
            }}
            loading={props.loading}
            onClick={props.onClick}
        >
            Follow
        </LoadingButton>
    )
}