import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'


interface Props {
    name: string
    isActive?: boolean
    onClick: () => void
}


export default function SettingsMenuItem ({ name, isActive = false, onClick }: Props) {

    return (
        <Box
            component='li'
            display='list-item'
            paddingY='10px'
            sx={{
                cursor: 'pointer',
                ...isActive && { backgroundColor: '#161616' },
                ...!isActive && { '&:hover': { backgroundColor: '#121212' } },
            }}
            onClick={onClick}
        >
            <Typography variant='body2' color='#FFFFFF' marginLeft='40px'>
                { name }
            </Typography>
        </Box>
    )
}