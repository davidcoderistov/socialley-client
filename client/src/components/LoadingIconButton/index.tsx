import React from 'react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'


interface Props {
    color: string
    loading: boolean
    iconComponent: any
    onClick: () => void
}

export default function LoadingIconButton ({ color, loading, iconComponent, onClick }: Props) {

    const size = iconComponent.props?.sx?.fontSize || 24

    return loading ? (
        <Button
            sx={{
                paddingX: '8px',
                paddingY: '11px',
                margin: 0,
                minWidth: 0,
            }}
            disabled={true}
        >
            <CircularProgress size={size - 6} sx={{ color }} />
        </Button>
    ) : (
        <IconButton
            sx={{ color }}
            onClick={onClick}
        >
            { iconComponent }
        </IconButton>
    )
}