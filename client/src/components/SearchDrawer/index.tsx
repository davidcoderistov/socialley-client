import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useApolloClient, useLazyQuery, useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { GET_SEARCHED_USERS } from '../../graphql/queries/users'
import { GetSearchedUsersQueryType } from '../../graphql/types/queries/users'
import { FOLLOW_USER, UNFOLLOW_USER } from '../../graphql/mutations/users'
import MuiDrawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import InputBase from '@mui/material/InputBase'
import { styled } from '@mui/material/styles'
import { Search } from '@mui/icons-material'
import FollowUserDetails from '../FollowUserDetails'
import _range from 'lodash/range'
import _debounce from 'lodash/debounce'
import searchedUsersMutations from '../../apollo/mutations/users/searchedUsers'


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
    onClose: () => void
}


export default function SearchDrawer (props: SearchDrawerProps) {

    const client = useApolloClient()

    const { enqueueSnackbar } = useSnackbar()

    const inputRef = useRef<HTMLInputElement>(null)
    const [inputKey, setInputKey] = useState(9999)

    const [getSearchedUsers, searchedUsers] = useLazyQuery<GetSearchedUsersQueryType>(GET_SEARCHED_USERS, {
        notifyOnNetworkStatusChange: true })

    const _getSearchedUsers = useMemo(() => _debounce(getSearchedUsers, 500), [])

    useEffect(() => {
        const searchQuery = inputRef?.current?.value.trim()
        if (!props.open && searchQuery && searchQuery.length > 0) {
            setInputKey(inputKey + 1)
            getSearchedUsers({
                variables: { searchQuery: '' },
                fetchPolicy: 'cache-only'
            })
        }
    }, [props.open, inputRef, getSearchedUsers])

    const handleChangeSearchQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleFollowUser = (userId: string) => {
        const searchQuery = inputRef?.current?.value.trim()
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
        const searchQuery = inputRef?.current?.value.trim()
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
                key={inputKey}
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
                <Box
                    component='div'
                    border='0'
                    flexGrow='1'
                    fontSize='100%'
                    left='0'
                    margin='0'
                    position='absolute'
                    width='100%'
                    paddingLeft={searchedUsers.loading ? '9px' : '24px'}
                    paddingRight='8px'
                    sx={{ overflowX: 'hidden', overflowY: 'auto', verticalAlign: 'baseline' }}
                >
                    { searchedUsers.loading ? _range(7).map(index => (
                        <FollowUserDetails
                            key={index}
                            isUserLoading={true} />
                    )) : users.map(searchedUser => (
                        <FollowUserDetails
                            key={searchedUser.followableUser.user._id}
                            user={{ ...searchedUser, ...searchedUser.followableUser, ...searchedUser.followableUser.user }}
                            dense
                            onFollowUser={handleFollowUser}
                            onUnfollowUser={handleUnfollowUser}
                            onClickUser={props.onClose} />
                    ))}
                </Box>
            </Box>
        </Drawer>
    )
}