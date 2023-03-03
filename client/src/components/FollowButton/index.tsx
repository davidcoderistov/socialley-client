import React from 'react'
import UserActionButton from '../UserActionButton'


interface FollowButtonProps {
    contained: boolean
    loading: boolean
    onClick: () => void
}

export default function FollowButton (props: FollowButtonProps) {

    return (
        <UserActionButton
            variant='primary'
            text='Follow'
            contained={props.contained}
            loading={props.loading}
            onClick={props.onClick} />
    )
}