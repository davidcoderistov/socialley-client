import React, { useMemo } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import UserAvatar from '../UserAvatar'
import { FavoriteBorder, Favorite } from '@mui/icons-material'
import { getTimeElapsed } from '../../utils'
import { Comment as CommentI } from '../../types'


interface CommentProps {
    comment: CommentI
    onLikeComment: (commentId: string) => void
}

export default function Comment (props: CommentProps) {

    const ago = useMemo(() => getTimeElapsed(props.comment.createdAt), [props.comment.createdAt])

    const handleLikeComment = () => {
        props.onLikeComment(props.comment._id)
    }

    return (
        <Box
            component='ul'
            fontSize='100%'
            margin='0'
            border='0'
            padding='0'
            marginBottom='16px'
            display='block'
            sx={{ verticalAlign: 'baseline', listStyleType: 'none' }}
        >
            <Box
                component='div'
                flexDirection='column'
                boxSizing='border-box'
                display='flex'
                flexShrink='0'
                alignItems='stretch'
                position='relative'
                fontSize='100%'
                margin='0'
                border='0'
                padding='0'
                sx={{ verticalAlign: 'baseline' }}
            >
                <Box
                    component='li'
                    paddingBottom='0'
                    overflow='visible'
                    padding='12px 0'
                    width='auto'
                    marginRight='-2px'
                    marginTop='-5px'
                    position='relative'
                    display='list-item'
                    sx={{ wordWrap: 'break-word', textAlign: '-webkit-match-parent' }}
                >
                    <Box
                        component='div'
                        alignItems='flex-start'
                        border='0'
                        boxSizing='border-box'
                        display='flex'
                        flexDirection='row'
                        fontSize='100%'
                        flexShrink='0'
                        justifyContent='space-between'
                        margin='0'
                        padding='0'
                        position='relative'
                        sx={{ verticalAlign: 'baseline' }}
                    >
                        <Box
                            component='div'
                            alignItems='flex-start'
                            display='flex'
                            flexDirection='row'
                            width='100% - 28px'
                        >
                            <UserAvatar
                                size={40}
                                fontSize={16}
                                firstName={props.comment.user.firstName}
                                lastName={props.comment.user.lastName} />
                            <Box
                                component='div'
                                border='0'
                                boxSizing='border-box'
                                display='inline-block'
                                flexShrink='1'
                                fontSize='100%'
                                margin='0'
                                minWidth='0'
                                padding='0'
                                position='relative'
                                marginLeft='14px'
                                sx={{ verticalAlign: 'baseline' }}
                            >
                                <Box
                                    component='h3'
                                    alignItems='center'
                                    display='inline-flex'
                                    color='#FFFFFF'
                                    fontSize='13px'
                                    fontWeight='600'
                                    margin='0'
                                    padding='0'
                                >
                                    <Box
                                        component='div'
                                        marginRight='4px'
                                        flex='0 0 auto'
                                        justifyContent='flex-start'
                                        flexDirection='column'
                                        alignItems='stretch'
                                        alignContent='stretch'
                                        display='flex'
                                        boxSizing='border-box'
                                        position='relative'
                                    >
                                        <Box
                                            component='div'
                                            display='inline'
                                        >
                                            <Box
                                                component='span'
                                                display='inline'
                                                position='relative'
                                            >
                                                { props.comment.user.username }
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box
                                    component='div'
                                    display='inline'
                                >
                                    <Box
                                        component='span'
                                        display='inline!important'
                                        margin='0!important'
                                        color='#FFFFFF'
                                        fontWeight='400'
                                        fontSize='14px'
                                        lineHeight='18px'
                                    >
                                        { props.comment.text }
                                    </Box>
                                </Box>
                                <Box
                                    component='div'
                                    marginTop='8px'
                                    marginBottom='4px'
                                    flex='0 0 auto'
                                    justifyContent='flex-start'
                                    flexDirection='column'
                                    alignItems='stretch'
                                    alignContent='stretch'
                                    display='flex'
                                    boxSizing='border-box'
                                    position='relative'
                                >
                                    <Box
                                        component='div'
                                        display='block'
                                        color='#A8A8A8'
                                        fontWeight='400'
                                        fontSize='12px'
                                        lineHeight='16px'
                                        margin='-2px 0 -3px'
                                    >
                                        <Box
                                            component='span'
                                            display='inline-block'
                                            marginRight='4px'
                                        >
                                            { ago }
                                        </Box>
                                        <Box
                                            component='span'
                                            display='inline-block'
                                            marginRight='4px'
                                        >
                                            &middot;
                                        </Box>
                                        <Box
                                            component='span'
                                            display='inline-block'
                                            marginRight='4px'
                                        >
                                            { props.comment.likesCount } likes
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box
                            component='span'
                            marginTop='9px'
                        >
                            <Box
                                component='div'
                                bgcolor='transparent'
                                border='none'
                                padding='0'
                            >
                                <IconButton sx={{ color: '#FFFFFF' }} onClick={handleLikeComment}>
                                    { props.comment.liked ? (
                                        <Favorite sx={{ fontSize: '16px' }} color='error' />
                                    ) : (
                                        <FavoriteBorder sx={{ fontSize: '16px' }} />
                                    )}
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}