import React, { useMemo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import UserAvatar from '../UserAvatar'
import moment from 'moment'


function getAgo (timestamp: number) {
    const now = moment()
    const ago = moment(timestamp)

    if (now.diff(ago, 'seconds') < 1) {
        return 'Now'
    } else if (now.diff(ago, 'minutes') < 1) {
        return `${now.diff(ago, 'seconds')}s`
    } else if (now.diff(ago, 'minutes') < 60) {
        return `${now.diff(ago, 'minutes')}m`
    } else if (now.diff(ago, 'hours') < 24) {
        return `${now.diff(ago, 'hours')}h`
    } else if (now.diff(ago, 'days') < 7) {
        return `${now.diff(ago, 'days')}d`
    } else {
        return `${now.diff(ago, 'weeks')}w`
    }
}

type RenderProps = {
    _id: string
    userId: string
    firstName: string
    lastName: string
    avatarURL: string | null
    photoURL?: string | null
    selected: boolean
    sent: boolean
    message?: string | null
    timestamp: number
    onClick: (userId: string) => void
    loading?: never
}

type LoadingProps = {
    _id?: never
    userId?: never
    firstName?: never
    lastName?: never
    avatarURL?: never
    photoURL?: never
    selected?: never
    sent?: never
    message?: never
    timestamp?: never
    onClick?: never
    loading: true
}

type Props = RenderProps | LoadingProps

export default function ChatMessageListItem (props: Props) {

    const ago = useMemo(() => props.timestamp ? getAgo(props.timestamp) : '', [props.timestamp])

    const message = useMemo(() => {
        if (props.message) {
            return props.message
        } else if (props.photoURL) {
            return props.sent ? 'You sent an attachment' : 'Sent you an attachment'
        } else {
            return null
        }
    }, [props.message, props.photoURL])

    const handleClick = () => {
        if (!props.selected && props.onClick && props.userId) {
            props.onClick(props.userId)
        }
    }

    return (
        <Box
            component='div'
            display='flex'
            flexDirection='row'
            columnGap='10px'
            px='20px'
            py='5px'
            sx={{
                ...props.selected && { backgroundColor: '#1E1E1E', },
                ...!props.selected && { '&:hover': { backgroundColor: '#121212', cursor: 'pointer', } },
            }}
            onClick={handleClick}
        >
            { props.loading ? (
                <Box
                    component='div'
                    width='56px'
                >
                    <Skeleton
                        component='div'
                        animation='wave'
                        variant='circular'
                        width='56px'
                        height='56px'
                        sx={{ backgroundColor: '#262626' }} />
                </Box>
            ) : (
                <UserAvatar
                    firstName={props.firstName ?? ''}
                    lastName={props.lastName ?? ''}
                    photoURL={props.avatarURL} />
            )}
            <Box
                component='div'
                display='flex'
                flexDirection='column'
                justifyContent='center'
                minWidth={0}
                width='100%'
            >
                { props.loading ? (
                    <Skeleton sx={{ backgroundColor: '#262626' }} animation='wave' />
                ) : (
                    <Typography
                        variant='body1'
                        noWrap
                    >
                        { props.firstName} {props.lastName }
                    </Typography>
                )}
                <Box
                    component='div'
                    display='flex'
                    flexDirection='row'
                    columnGap='4px'
                >
                    { props.loading ? (
                        <Skeleton sx={{ backgroundColor: '#262626', width: '75%' }} animation='wave' />
                    ) : message ? (
                        <>
                            <Typography
                                variant='body2'
                                color='#8E8E8E'
                                noWrap
                            >{ message }</Typography>
                            <Typography
                                variant='body2'
                                color='#8E8E8E'
                            >&middot;</Typography>
                            <Typography
                                variant='body2'
                                color='#8E8E8E'
                            >{ ago }</Typography>
                        </>
                    ) : null }
                </Box>
            </Box>
        </Box>
    )
}