import React, { useState } from 'react'
import Box from '@mui/material/Box'
import EditProfile from '../EditProfile'
import ChangePassword from '../ChangePassword'
import SettingsMenuItem from './SettingsMenuItem'
import LogoutModal from '../LogoutModal'


export default function UserProfileSettings () {

    const [activeStep, setActiveStep] = useState(1)
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

    const handleClickEditProfile = () => {
        if (activeStep !== 1) {
            setActiveStep(1)
        }
    }


    const handleClickChangePassword = () => {
        if (activeStep !== 2) {
            setActiveStep(2)
        }
    }

    const handleClickLogOut = () => {
        setIsLogoutModalOpen(true)
    }

    const handleCloseLogoutModal = () => {
        setIsLogoutModalOpen(false)
    }

    return (
        <Box color='#FFFFFF' width='100%' height='calc(100vh - 60px)'>
            <Box
                component='div'
                margin='30px auto 0'
                bgcolor='#000000'
                border='1px solid #363636'
                borderRadius='3px'
                boxSizing='border-box'
                display='flex'
                flexDirection='row'
                flexGrow='1'
                justifyContent='stretch'
                maxWidth='935px'
                overflow='hidden'
                width='100%'
                height='100%'
            >
                <Box
                    component='ul'
                    borderRight='1px solid #363636'
                    display='flex'
                    flexBasis='236px'
                    flexDirection='column'
                    flexGrow='0'
                    flexShrink='0'
                    margin='0'
                    padding='0'
                    sx={{
                        listStyleType: 'none',
                        marginInlineStart: '0',
                        marginInlineEnd: '0',
                        pt: 4,
                    }}
                >
                    <SettingsMenuItem
                        name='Edit profile'
                        isActive={activeStep === 1}
                        onClick={handleClickEditProfile} />
                    <SettingsMenuItem
                        name='Change password'
                        isActive={activeStep === 2}
                        onClick={handleClickChangePassword} />
                    <SettingsMenuItem
                        name='Log out'
                        onClick={handleClickLogOut} />
                </Box>
                <Box
                    component='div'
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                    width='100%'
                >
                    { activeStep === 1 && (
                        <EditProfile />
                    )}
                    { activeStep === 2 && (
                        <ChangePassword />
                    )}
                </Box>
            </Box>
            <LogoutModal
                open={isLogoutModalOpen}
                onCloseModal={handleCloseLogoutModal} />
        </Box>
    )
}