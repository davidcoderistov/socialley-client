import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useApolloClient, useLazyQuery, useMutation } from '@apollo/client'
import { useProfileNavigate } from '../../hooks/misc'
import { useSnackbar } from 'notistack'
import { GET_SEARCHED_USERS, GET_SEARCHED_USERS_FOR_USER } from '../../graphql/queries/users'
import { GetSearchedUsersQueryType, GetSearchedUsersForUserQueryType } from '../../graphql/types/queries/users'
import { FOLLOW_USER, UNFOLLOW_USER, MARK_USER_AS_SEARCHED } from '../../graphql/mutations/users'
import MuiDrawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import InputBase from '@mui/material/InputBase'
import { styled } from '@mui/material/styles'
import { Search, Close } from '@mui/icons-material'
import FollowUserDetails from '../FollowUserDetails'
import SearchHistory from '../SearchHistory'
import _range from 'lodash/range'
import _debounce from 'lodash/debounce'
import searchedUsersMutations from '../../apollo/mutations/users/searchedUsers'
import { addSearchedUser } from '../../apollo/mutations/users/searchedUsersForUser'


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: 390,
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
                width: 0,
            }),
        },
    }),
)

interface SearchDrawerProps {
    open: boolean
}

export default function SearchDrawer (props: SearchDrawerProps) {

    const client = useApolloClient()

    const navigate = useProfileNavigate()

    const { enqueueSnackbar } = useSnackbar()

    const inputRef = useRef<HTMLInputElement>()
    const [searchQuery, setSearchQuery] = useState('')

    const [getSearchedUsers, searchedUsers] = useLazyQuery<GetSearchedUsersQueryType>(GET_SEARCHED_USERS, {
        notifyOnNetworkStatusChange: true })

    const _getSearchedUsers = useMemo(() => _debounce(getSearchedUsers, 500), [])

    useEffect(() => {
        if (!props.open && searchQuery && searchQuery.length > 0) {
            setSearchQuery('')
            getSearchedUsers({
                variables: { searchQuery: '' },
                fetchPolicy: 'cache-only'
            })
        }
    }, [props.open, searchQuery, getSearchedUsers])

    const handleChangeSearchQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value)
        const searchQuery = event.target.value.trim()
        if (searchQuery.length > 0) {
            _getSearchedUsers({
                variables: { searchQuery }
            })
        } else {
            _getSearchedUsers({
                variables: { searchQuery },
                fetchPolicy: 'cache-only'
            })
        }
    }

    const handleClearSearchQuery = () => {
        setSearchQuery('')
        inputRef.current?.focus()
    }

    const users = useMemo(() => {
        if (!searchedUsers.loading && !searchedUsers.error && searchedUsers.data) {
            return searchedUsers.data.getSearchedUsers
        }
        return []
    }, [searchedUsers])

    const handleClickDrawer = (event: React.MouseEvent) => {
        event.stopPropagation()
    }

    const [followUser] = useMutation(FOLLOW_USER)
    const [unfollowUser] = useMutation(UNFOLLOW_USER)

    const updateSearchedUserFollowingLoadingStatus = (userId: string, isFollowingLoading: boolean, searchQuery: string) => {
        client.cache.updateQuery({
            query: GET_SEARCHED_USERS,
            variables: { searchQuery }
        }, (searchedUsers: GetSearchedUsersQueryType | null) => {
            if (searchedUsers) {
                return searchedUsersMutations.updateFollowingLoadingStatus({
                    searchedUsers,
                    userId,
                    isFollowingLoading,
                }).searchedUsers
            }
        })
    }

    const updateSearchedUserFollowingStatus = (userId: string, following: boolean, searchQuery: string) => {
        client.cache.updateQuery({
            query: GET_SEARCHED_USERS,
            variables: { searchQuery }
        }, (searchedUsers: GetSearchedUsersQueryType | null) => {
            if (searchedUsers) {
                return searchedUsersMutations.updateFollowingStatus({
                    searchedUsers,
                    userId,
                    following,
                }).searchedUsers
            }
        })
    }

    const handleFollowUser = (userId: string, event: React.MouseEvent) => {
        event.stopPropagation()
        if (searchQuery && searchQuery.length > 0) {
            updateSearchedUserFollowingLoadingStatus(userId, true, searchQuery)
            followUser({
                variables: {
                    followedUserId: userId
                }
            }).then(() => {
                updateSearchedUserFollowingStatus(userId, true, searchQuery)
            }).catch(() => {
                updateSearchedUserFollowingLoadingStatus(userId, false, searchQuery)
                enqueueSnackbar('Could not follow user', { variant: 'error' })
            })
        }
    }

    const handleUnfollowUser = (userId: string) => {
        if (searchQuery && searchQuery.length > 0) {
            updateSearchedUserFollowingLoadingStatus(userId, true, searchQuery)
            unfollowUser({
                variables: {
                    followedUserId: userId
                }
            }).then(() => {
                updateSearchedUserFollowingStatus(userId, false, searchQuery)
            }).catch(() => {
                updateSearchedUserFollowingLoadingStatus(userId, false, searchQuery)
                enqueueSnackbar('Could not unfollow user', { variant: 'error' })
            })
        }
    }

    const [markUserAsSearched] = useMutation(MARK_USER_AS_SEARCHED)

    const handleClickUser = (userId: string) => {
        navigate(userId)

        const searchedUser = users.find(user => user.followableUser.user._id === userId)
        if (searchedUser) {
            client.cache.updateQuery({
                query: GET_SEARCHED_USERS_FOR_USER
            }, (searchedUsersForUser: GetSearchedUsersForUserQueryType | null) => {
                if (!searchedUsersForUser || searchedUsersForUser.getSearchedUsersForUser.length === 0 || searchedUsersForUser.getSearchedUsersForUser[0]._id !== userId) {
                    markUserAsSearched({ variables: { searchedUserId: userId }})
                }
                if (searchedUsersForUser) {
                    return addSearchedUser({
                        searchedUsersForUser,
                        searchedUser: searchedUser.followableUser.user,
                    })
                }
            })
        }
    }

    return (
        <Drawer
            variant='permanent'
            anchor='left'
            open={props.open}
            PaperProps={{ sx: { backgroundColor: 'black', borderRight: '1px solid #232323' }}}
            onClick={handleClickDrawer}
        >
            <Toolbar
                sx={{
                    pt: [4],
                    pb: [3],
                }}
            >
                <Typography noWrap variant='h5' color='#FFFFFF' sx={{ fontFamily: 'Bosca' }}>
                    Search
                </Typography>
            </Toolbar>
            <Divider />
            <InputBase
                inputRef={inputRef}
                sx={{
                    color: '#FFFFFF',
                    backgroundColor: '#262626',
                    marginX: '24px',
                    paddingX: '15px',
                    paddingY: '5px',
                    borderRadius: '10px',
                    '& input': {
                        MozAppearance: 'textfield',
                        '&::placeholder': {
                            fontSize: '14px',
                            color: '#EEEEFF'
                        },
                    },
                }}
                startAdornment={<Search sx={{ marginRight: '5px', color: '#7A7C7F' }}/>}
                endAdornment={
                    <IconButton
                        sx={{ paddingY: 0, ...searchQuery.trim().length < 1 && { display: 'none' }}}
                        onClick={handleClearSearchQuery}
                    >
                        <Close sx={{ color: '#FFFFFF' }} />
                    </IconButton>
                }
                value={searchQuery}
                onChange={handleChangeSearchQuery}
                placeholder='Search'
                autoFocus
            />
            <Box
                component='div'
                marginTop='24px'
                borderTop='1px solid #262626'
            />
            <Box
                component='div'
                paddingY='8px'
                display='flex'
                flexDirection='column'
                flexGrow='1'
                flexShrink='1'
                minHeight='0'
                position='relative'
                sx={{ overflowX: 'hidden', overflowY: 'auto' }}
            >
                { searchQuery.trim().length > 0 ? (
                    <Box
                        component='div'
                        border='0'
                        flexGrow='1'
                        fontSize='100%'
                        left='0'
                        margin='0'
                        position='absolute'
                        width='100%'
                        paddingLeft={searchedUsers.loading ? '9px' : '0'}
                        sx={{ overflowX: 'hidden', overflowY: 'auto', verticalAlign: 'baseline' }}
                    >
                        { searchedUsers.loading ? _range(7).map(index => (
                            <FollowUserDetails
                                key={index}
                                isUserLoading={true} />
                        )) : users.map(searchedUser => (
                            <Box
                                key={searchedUser.followableUser.user._id}
                                component='div'
                                paddingLeft='24px'
                                paddingRight='24px'
                                sx={{ '&:hover': { backgroundColor: '#121212' }, cursor: 'pointer' }}
                                onClick={() => handleClickUser(searchedUser.followableUser.user._id)}
                            >
                                <FollowUserDetails
                                    user={{ ...searchedUser, ...searchedUser.followableUser, ...searchedUser.followableUser.user }}
                                    dense
                                    clickable={false}
                                    onFollowUser={handleFollowUser}
                                    onUnfollowUser={handleUnfollowUser} />
                            </Box>
                        ))}
                    </Box>
                ): (
                    <SearchHistory skipFetch={!props.open} />
                )}
            </Box>
        </Drawer>
    )
}