import React from 'react'
import { Box, ListItemIcon, Typography, styled } from '@mui/material'
import {
    Home,
    Reply,
    AddCircleOutline,
    AccountCircle,
    Search,
    ExploreOutlined,
    FavoriteBorder,
    FormatListBulleted,
} from '@mui/icons-material'


const Container = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
})

export type NavType = 'home' | 'messages' | 'profile' | 'create' | 'search' | 'explore' | 'notifications' | 'more'

interface NavItemProps {
    active: boolean
    hovered: boolean
    bordered?: boolean
    type: NavType
}

export default function NavItem ({ active, hovered, type, bordered = false }: NavItemProps) {

    const hoveredNotActive = hovered && !active

    const iconSx = {
        color: '#FFFFFF',
        fontSize: 30,
    }

    return (
        <Container sx={{
            marginY: '12px',
            position: 'relative',
            ...hoveredNotActive && { borderRadius: '20px', backgroundColor: '#0f0f0f' },
            ...active && { borderRadius: '20px', backgroundColor: '#161616' }
        }}>
            { bordered && (
                <Box
                    position='absolute'
                    border='1px solid #FFFFFF'
                    borderRadius='50%'
                    width='36px'
                    height='36px'
                    left='5px'
                />
            )}
            <ListItemIcon sx={{ minWidth: '40px' }}>
                { type === 'home' && (
                    <Home sx={iconSx}/>
                )}
                { type === 'messages' && (
                    <Reply sx={iconSx}/>
                )}
                { type === 'create' && (
                    <AddCircleOutline sx={iconSx} />
                )}
                { type === 'profile' && (
                    <AccountCircle sx={iconSx}/>
                )}
                { type === 'search' && (
                    <Search sx={iconSx}/>
                )}
                { type === 'explore' && (
                    <ExploreOutlined sx={iconSx}/>
                )}
                { type === 'notifications' && (
                    <FavoriteBorder sx={iconSx}/>
                )}
                { type === 'more' && (
                    <FormatListBulleted sx={iconSx}/>
                )}
            </ListItemIcon>
            <Typography noWrap marginY='4px' fontSize={15} sx={{ color: '#FFFFFF' }}>
                { type === 'home' && 'Home '}
                { type === 'messages' && 'Messages' }
                { type === 'create' && 'Create' }
                { type === 'profile' && 'Profile' }
                { type === 'search' && 'Search' }
                { type === 'explore' && 'Explore' }
                { type === 'notifications' && 'Notifications' }
                { type === 'more' && 'More' }
            </Typography>
        </Container>
    )
}