import React from 'react'
import UserActionButton from '../UserActionButton'


interface FollowingButtonProps {
    contained: boolean
    loading: boolean
    onClick: (event: React.MouseEvent) => void
}

export default function FollowingButton (props: FollowingButtonProps) {

    return (
        <UserActionButton
            variant='secondary'
            text='Following'
            contained={props.contained}
            loading={props.loading}
            onClick={props.onClick} />
    )
}