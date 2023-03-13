import React from 'react'
import LoadingButton from '@mui/lab/LoadingButton'


interface UserActionButtonProps {
    variant: 'primary' | 'secondary'
    text: string
    minWidth?: number
    contained: boolean
    loading: boolean
    onClick: (event: React.MouseEvent) => void
}

export default function UserActionButton (props: UserActionButtonProps) {

    const primary = props.variant === 'primary'

    return (
        <LoadingButton
            variant={props.contained ? 'contained' : 'text'}
            sx={props.contained ? {
                textTransform: 'none',
                borderRadius: '10px',
                ...!!props.minWidth && { minWidth: props.minWidth },
                backgroundColor: primary ? '#0095F6': '#EFEFEF',
                ...!primary && { color: '#000000' },
                '&:hover': {
                    backgroundColor: primary ? '#1877F2' : '#DBDBDB'
                },
                '&.MuiLoadingButton-loading': {
                    backgroundColor: primary ? '#0095F6' : '#FFFFFF',
                },
                '.MuiLoadingButton-loadingIndicator': {
                    color: primary ? '#FFFFFF' : '#000000',
                }
            } : {
                textTransform: 'none',
                color: primary ? '#0095F6' : '#DBDBDB',
                '&:hover': {
                    color: '#FFFFFF',
                },
                '.MuiLoadingButton-loadingIndicator': {
                    color: primary ? '#0095F6' : '#DBDBDB',
                },
                paddingX: 0
            }}
            loading={props.loading}
            onClick={props.onClick}
        >
            { props.text }
        </LoadingButton>
    )
}