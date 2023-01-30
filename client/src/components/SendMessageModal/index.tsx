import React, { useEffect, useMemo } from 'react'
import { useLazyQuery } from '@apollo/client'
import { GET_USERS_BY_SEARCH_QUERY } from '../../graphql/queries/users'
import { UsersBySearchQueryData } from '../../graphql/types'
import { Box, Typography, IconButton, InputBase } from '@mui/material'
import { Dialog } from '@mui/material'
import { Close } from '@mui/icons-material'
import UserList from './UserList'
import _debounce from 'lodash/debounce'


interface User {
    _id: string
    username: string
    firstName: string
    lastName: string
    avatarURL?: string | null
}

interface Props {
    open: boolean
    onClickUser: (user: User) => void
    onCloseModal: () => void
}

export default function SendMessageModal (props: Props) {

    const [findUsersBySearchQuery, { loading, data }] = useLazyQuery<UsersBySearchQueryData>(GET_USERS_BY_SEARCH_QUERY)

    const _findUsersBySearchQuery = useMemo(() => _debounce(findUsersBySearchQuery, 500), [])

    const handleChangeSearchQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
        _findUsersBySearchQuery({
            variables: {
                searchQuery: event.target.value,
                limit: 5,
            }
        })
    }

    useEffect(() => {
        findUsersBySearchQuery({
            variables: {
                searchQuery: '',
                limit: 5,
            }
        })
    }, [])

    return (
        <Dialog
            open={props.open}
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: '#262626',
                    borderRadius: '20px',
                    maxWidth: '400px',
                    paddingBottom: '10px',
                    height: '480px'
                }
            }}
        >
            <Box
                component='div'
                display='flex'
                flexDirection='row'
                justifyContent='space-between'
                alignItems='center'
            >
                <Box component='div' />
                <Typography color='#FFFFFF'>New message</Typography>
                <IconButton
                    aria-label='close'
                    onClick={props.onCloseModal}
                    sx={{ paddingTop: '15px' }}
                >
                    <Close sx={{ color: '#FFFFFF' }} />
                </IconButton>
            </Box>
            <Box component='div'>
                <Box
                    component='div'
                    display='flex'
                    flexDirection='row'
                    padding='10px'
                    columnGap='15px'
                >
                    <Typography
                        variant='body1'
                        color='#FFFFFF'
                    >To:</Typography>
                    <InputBase
                        sx={{
                            color: '#FFFFFF',
                        }}
                        onChange={handleChangeSearchQuery}
                        placeholder='Search...'
                        fullWidth
                        autoFocus
                    />
                </Box>
                <Box
                    component='div'
                    paddingTop='25px'
                    paddingBottom='10px'
                    paddingX='15px'
                >
                    <Typography
                        variant='body2'
                        color='#FFFFFF'
                    >Suggested</Typography>
                </Box>
                <UserList
                    loading={loading}
                    users={data?.getUsersBySearchQuery ?? []}
                    onClick={props.onClickUser} />
            </Box>
        </Dialog>
    )
}