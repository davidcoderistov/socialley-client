import React, { useMemo } from 'react'
import { useProfileNavigate } from '../../hooks/misc'
import { useQuery, useMutation } from '@apollo/client'
import { GET_SEARCHED_USERS_FOR_USER } from '../../graphql/queries/users'
import { GetSearchedUsersForUserQueryType } from '../../graphql/types/queries/users'
import { MARK_USER_AS_UNSEARCHED, CLEAR_SEARCH_HISTORY } from '../../graphql/mutations/users'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import SearchHistoryUser from './SearchHistoryUser'
import _range from 'lodash/range'
import { removeSearchedUser } from '../../apollo/mutations/users/searchedUsersForUser'


export default function SearchHistory ({ skipFetch }: { skipFetch: boolean }) {

    const navigate = useProfileNavigate()

    const searchedUsersForUser = useQuery<GetSearchedUsersForUserQueryType>(GET_SEARCHED_USERS_FOR_USER, { skip: skipFetch })

    const searchedUsers = useMemo(() => {
        if (!searchedUsersForUser.loading && !searchedUsersForUser.error && searchedUsersForUser.data) {
            return searchedUsersForUser.data.getSearchedUsersForUser
        }
        return []
    }, [searchedUsersForUser])

    const handleClickUser = (userId: string) => {
        navigate(userId)
    }

    const [markUserAsUnsearched] = useMutation(MARK_USER_AS_UNSEARCHED)
    const [clearSearchHistory] = useMutation(CLEAR_SEARCH_HISTORY)

    const handleRemoveUser = (userId: string) => {
        searchedUsersForUser.updateQuery(searchedUsersForUser => removeSearchedUser({
            searchedUsersForUser,
            userId,
        }))
        markUserAsUnsearched({ variables: { searchedUserId: userId }})
    }

    const handleClearAll = () => {
        searchedUsersForUser.updateQuery(searchedUsersForUser => ({
            ...searchedUsersForUser,
            getSearchedUsersForUser: []
        }))
        clearSearchHistory()
    }

    return (
        <>
            <Box
                component='div'
                border='0'
                flexGrow='1'
                fontSize='100%'
                left='0'
                margin='0'
                position='absolute'
                width='100%'
                sx={{ overflowX: 'hidden', overflowY: 'auto', verticalAlign: 'baseline' }}
            >
                <Box
                    component='div'
                    display='flex'
                    flexDirection='row'
                    justifyContent='space-between'
                    alignItems='center'
                    paddingX='24px'
                    marginBottom='10px'
                >
                    <Typography
                        fontSize={16}
                        color='#FFFFFF'
                        noWrap
                    >
                        Recent
                    </Typography>
                    { !searchedUsersForUser.loading && searchedUsers.length > 0 && (
                        <Button
                            variant='text'
                            color='primary'
                            sx={{
                                textTransform: 'none',
                                '&:hover': {
                                    color: '#FFFFFF'
                                }
                            }}
                            onClick={handleClearAll}
                        >
                            Clear All
                        </Button>
                    )}
                </Box>
                { searchedUsersForUser.loading ? _range(7).map(index => (
                    <SearchHistoryUser
                        key={index}
                        isUserLoading />
                )): searchedUsers.map(searchedUser => (
                    <SearchHistoryUser
                        key={searchedUser._id}
                        user={searchedUser}
                        onClickUser={handleClickUser}
                        onRemoveUser={handleRemoveUser} />
                ))}
            </Box>
            { !searchedUsersForUser.loading && searchedUsers.length === 0 && (
                <Box
                    component='div'
                    position='absolute'
                    top='50%'
                    display='flex'
                    flexDirection='column'
                    justifyContent='center'
                    alignItems='center'
                    width='100%'
                >
                    <Typography
                        fontSize={14}
                        color='#A8A8A8'
                    >
                        No recent searches.
                    </Typography>
                </Box>
            )}
        </>
    )
}