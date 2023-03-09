import React, { useState } from 'react'
import {
    Box,
    List,
    Drawer as MuiDrawer,
    Toolbar,
    Divider,
    CssBaseline,
    Typography,
} from '@mui/material'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import NavLink from './NavLink'
import CreatePostModal from '../CreatePostModal'
import SearchDrawer from '../SearchDrawer'
import { useLocation } from 'react-router-dom'


const drawerWidth: number = 265

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
)

const mdTheme = createTheme({
    typography: {
        'fontFamily': 'Verdana',
    }
})

interface Props {
    children: any
}

export default function Dashboard (props: Props) {

    const [isAppDrawerOpen, setIsAppDrawerOpen] = useState(true)
    const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false)

    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false)

    const location = useLocation()

    const backgroundColor =
        location.pathname === '/' || location.pathname === '/profile' || location.pathname.startsWith('/users') ? '#000000' : '#121212'

    const handleOpenCreatePostModal = () => {
        setIsCreatePostModalOpen(true)
    }

    const handleCloseCreatePostModal = () => {
        setIsCreatePostModalOpen(false)
    }

    const handleOpenSearchDrawer = () => {
        setIsAppDrawerOpen(false)
        setIsSearchDrawerOpen(true)
    }

    const handleClickApp = () => {
        if (isSearchDrawerOpen) {
            setIsAppDrawerOpen(true)
            setIsSearchDrawerOpen(false)
        }
    }

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }} onClick={handleClickApp}>
                <CssBaseline />
                <Drawer variant='permanent' open={isAppDrawerOpen} PaperProps={{ sx: { backgroundColor: 'black', borderRight: '1px solid #232323' }}}>
                    <Toolbar
                        sx={{
                            pt: [4],
                            pb: [3],
                        }}
                    >
                        <Typography noWrap variant='h5' color='#FFFFFF' sx={{ fontFamily: 'Bosca' }}>
                            { isAppDrawerOpen && 'Socialley' }
                        </Typography>
                    </Toolbar>
                    <Divider />
                    <List component='nav' sx={{ paddingX: '12px' }}>
                        <NavLink to='/' type='home' />
                        <NavLink isNotLink type='search' bordered={isSearchDrawerOpen} onClick={handleOpenSearchDrawer} />
                        <NavLink to='/messages' type='messages' />
                        <NavLink isNotLink type='create' onClick={handleOpenCreatePostModal} />
                        <NavLink to='/profile' type='profile' />
                    </List>
                </Drawer>
                <SearchDrawer open={isSearchDrawerOpen} />
                <Box
                    component='main'
                    sx={{
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                        backgroundColor: 'black',
                        color: 'white'
                    }}
                >
                    <Box
                        component='div'
                        height='100%'
                        width='100%'
                    >
                        <Box
                            component='section'
                            width='100%'
                            height='100%'
                            display='flex'
                            flexDirection='column'
                            flexGrow='1'
                        >
                            <Box
                                component='div'
                                height='100%'
                                display='flex'
                                flexDirection='column'
                                flexGrow='1'
                                bgcolor={backgroundColor}
                                maxHeight='100%'
                            >
                                <Box
                                    component='div'
                                    height='100%'
                                    width='100%'
                                    minHeight={0}
                                    minWidth={0}
                                    flex='1 1 auto'
                                    display='flex'
                                    flexDirection='column'
                                    justifyContent='flex-start'
                                    alignItems='stretch'
                                    alignContent='stretch'
                                    position='relative'
                                    boxSizing='border-box'
                                >
                                    <Box
                                        component='div'
                                        height='100%'
                                        width='100%'
                                        display='flex'
                                        flexDirection='column'
                                        alignItems='center'
                                        border='0'
                                        position='relative'
                                        boxSizing='border-box'
                                        margin='0'
                                    >
                                        { props.children }
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            { isCreatePostModalOpen && (
                <CreatePostModal
                    open={isCreatePostModalOpen}
                    onClose={handleCloseCreatePostModal} />
            )}
        </ThemeProvider>
    )
}