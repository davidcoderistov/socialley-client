import React from 'react'
import { useInfiniteScroll } from '../../hooks/misc'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import FollowUserDetails from '../FollowUserDetails'
import _range from 'lodash/range'


interface User {
    _id: string
    username: string
    firstName: string
    lastName: string
    avatarURL: string | null
    following: boolean
    isFollowingLoading: boolean
}

interface Props {
    users: User[]
    isInitialLoading: boolean
    isMoreLoading: boolean
    hasMoreUsers: boolean
    onFetchMoreUsers: () => void
    onFollowUser: (userId: string) => void
    onUnfollowUser: (userId: string) => void
    onClickUser: (userId: string) => void
}

export default function UserList (props: Props) {

    const infiniteScrollRef = useInfiniteScroll<HTMLDivElement>(props.onFetchMoreUsers)

    return (
        <Box
            id='scrollableLikingUserList'
            component='div'
            display='block'
            marginTop='25px'
            marginBottom='10px'
            height='100%'
            width='100%'
            sx={{ overflowX: 'hidden', overflowY: 'auto' }}
        >
            { props.isInitialLoading ? _range(5).map(index => (
                <FollowUserDetails
                    key={index}
                    dark
                    isUserLoading={true} />
            )) : (
                <>
                    { props.users.map(user => (
                        <FollowUserDetails
                            key={user._id}
                            dark
                            user={user}
                            onFollowUser={props.onFollowUser}
                            onUnfollowUser={props.onUnfollowUser}
                            onClickUser={props.onClickUser}
                        />
                    )) }
                    { props.hasMoreUsers && (
                        <Box
                            ref={infiniteScrollRef}
                            component='div'
                            display='flex'
                            flexDirection='row'
                            justifyContent='center'
                            alignItems='flex-start'
                            height='50px'
                        >
                            <CircularProgress size={30} sx={{ color: '#FFFFFF', mt: 1 }} />
                        </Box>
                    )}
                </>
            )}
        </Box>
    )
}