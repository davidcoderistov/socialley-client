import React from 'react'
import LoadingButton from '@mui/lab/LoadingButton'


interface FollowingButtonProps {
    contained: boolean
    loading: boolean
    onClick: () => void
}

export default function FollowingButton (props: FollowingButtonProps) {

    return (
        <LoadingButton
            variant={props.contained ? 'contained' : 'text'}
            sx={props.contained ? {
                textTransform: 'none',
                borderRadius: '10px',
                minWidth: '100px',
                backgroundColor: '#EFEFEF',
                color: '#000000',
                '&:hover': {
                    backgroundColor: '#DBDBDB'
                },
                '&.MuiLoadingButton-loading': {
                    backgroundColor: '#FFFFFF',
                },
                '.MuiLoadingButton-loadingIndicator': {
                    color: '#000000',
                }
            } : {
                textTransform: 'none',
                color: '#DBDBDB',
                '&:hover': {
                    color: '#FFFFFF',
                },
                '.MuiLoadingButton-loadingIndicator': {
                    color: '#DBDBDB',
                }
            }}
            loading={props.loading}
            onClick={props.onClick}
        >
            Following
        </LoadingButton>
    )
}