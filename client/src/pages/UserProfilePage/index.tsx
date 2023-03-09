import React from 'react'
import { useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import UserProfile from '../../components/UserProfile'


export default function UserProfilePage () {

    const { id } = useParams()

    return (
        <Box color='#FFFFFF' width='100%' marginTop='40px'>
            <UserProfile userId={id ?? ''} />
        </Box>
    )
}