import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state'
import NavLink from '../Dashboard/NavLink'
import LogoutModal from '../LogoutModal'


export default function MoreMenu () {

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

    const navigate = useNavigate()

    const handleClickViewProfile = (closeMenu: () => void) => {
        navigate('/profile')
        closeMenu()
    }

    const handleClickEditProfile = (closeMenu: () => void) => {
        navigate('/profile/settings')
        closeMenu()
    }

    const handleClickLogOut = (closeMenu: () => void) => {
        setIsLogoutModalOpen(true)
        closeMenu()
    }

    const handleCloseLogoutModal = () => {
        setIsLogoutModalOpen(false)
    }

    return (
        <PopupState variant='popover' popupId='more-popup-menu' disableAutoFocus={true} parentPopupState={null}>
            {(popupState) => (
                <React.Fragment>
                    <Box
                        component='div'
                        position='absolute'
                        bottom={0}
                        width='100%'
                        paddingX='12px'
                        marginBottom='20px'
                    >
                        <NavLink isNotLink type='more' onClick={bindTrigger(popupState).onClick} />
                    </Box>
                    <Menu
                        {...bindMenu(popupState)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        sx={{ '.MuiMenu-paper': { backgroundColor: '#262626', color: '#FFFFFF', minWidth: '150px' }}}
                    >
                        <MenuItem onClick={() => handleClickViewProfile(popupState.close)}>View Profile</MenuItem>
                        <MenuItem onClick={() => handleClickEditProfile(popupState.close)}>Edit profile</MenuItem>
                        <MenuItem onClick={() => handleClickLogOut(popupState.close)}>Log out</MenuItem>
                    </Menu>
                    <LogoutModal
                        open={isLogoutModalOpen}
                        onCloseModal={handleCloseLogoutModal} />
                </React.Fragment>
            )}
        </PopupState>
    )
}
