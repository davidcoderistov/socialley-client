import React, {useState, useMemo, useEffect} from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import UserAvatar from '../UserAvatar'
import UserLikesModal from '../UserLikesModal'
import LoadingIconButton from '../LoadingIconButton'
import { FavoriteBorder, Favorite } from '@mui/icons-material'
import { getTimeElapsed } from '../../utils'
import { Comment as CommentI } from '../../graphql/types/models'
import { GET_USERS_WHO_LIKED_COMMENT } from '../../graphql/queries/posts'
import { GetUsersWhoLikedCommentQueryType } from '../../graphql/types/queries/posts'
import { FOLLOW_USER, UNFOLLOW_USER } from '../../graphql/mutations/users'
import { UnfollowUserMutationType } from '../../graphql/types/mutations/users'
import usersWhoLikedCommentMutations from '../../apollo/mutations/posts/usersWhoLikedComment'


interface StaticProps {
    comment: CommentI
    dense: boolean
    onLikeComment: (commentId: string, postId: string, liked: boolean) => void
    loading?: never
}

interface LoadingProps {
    comment?: never
    dense?: never
    onLikeComment?: never
    loading: true
}

type CommentProps = StaticProps | LoadingProps

export default function Comment (props: CommentProps) {

    const ago = useMemo(() => props.loading ? '' : getTimeElapsed(props.comment.createdAt), [props.comment, props.loading])

    const handleLikeComment = () => {
        if (!props.loading) {
            props.onLikeComment(props.comment._id, props.comment.postId, !props.comment.liked)
        }
    }

    const { enqueueSnackbar } = useSnackbar()

    const [isUserLikesModalOpen, setIsUserLikesModalOpen] = useState(false)
    const [isInitialLoading, setIsInitialLoading] = useState(false)

    const [getUsersWhoLikedComment, usersWhoLikedComment] = useLazyQuery<GetUsersWhoLikedCommentQueryType>(GET_USERS_WHO_LIKED_COMMENT)

    const [followUser] = useMutation(FOLLOW_USER)
    const [unfollowUser] = useMutation<UnfollowUserMutationType>(UNFOLLOW_USER)

    const handleViewLikingUsers = () => {
        const comment = props.comment as CommentI
        setIsUserLikesModalOpen(true)
        if (!usersWhoLikedComment.called) {
            setIsInitialLoading(true)
            getUsersWhoLikedComment({
                variables: {
                    commentId: comment._id,
                    offset: 0,
                    limit: 10,
                }
            }).finally(() => setIsInitialLoading(false))
        }
    }

    const handleFetchMoreUsers = () => {
        if (usersWhoLikedComment.data) {
            usersWhoLikedComment.fetchMore({
                variables: {
                    offset: usersWhoLikedComment.data.getUsersWhoLikedComment.data.length,
                    limit: 10,
                }
            })
        }
    }

    const updateCommentQueryFollowingLoadingStatus = (userId: string, isFollowingLoading: boolean) => {
        usersWhoLikedComment.updateQuery((prevUsersWhoLikedComment) => {
            return usersWhoLikedCommentMutations.updateFollowingLoadingStatus({
                usersWhoLikedComment: prevUsersWhoLikedComment,
                userId,
                isFollowingLoading,
            }).usersWhoLikedComment
        })
    }

    const updateCommentQueryFollowingStatus = (userId: string, following: boolean) => {
        usersWhoLikedComment.updateQuery((prevUsersWhoLikedComment) => {
            return usersWhoLikedCommentMutations.updateFollowingStatus({
                usersWhoLikedComment: prevUsersWhoLikedComment,
                userId,
                following,
            }).usersWhoLikedComment
        })
    }

    const handleFollowUser = (userId: string) => {
        updateCommentQueryFollowingLoadingStatus(userId, true)
        followUser({
            variables: {
                followedUserId: userId
            }
        }).then(() => {
            updateCommentQueryFollowingStatus(userId, true)
        }).catch(() => {
            updateCommentQueryFollowingLoadingStatus(userId, false)
            enqueueSnackbar('Could not follow user', { variant: 'error' })
        })
    }

    const handleUnfollowUser = (userId: string) => {
        updateCommentQueryFollowingLoadingStatus(userId, true)
        unfollowUser({
            variables: {
                followedUserId: userId
            }
        }).then(() => {
            updateCommentQueryFollowingStatus(userId, false)
        }).catch(() => {
            updateCommentQueryFollowingLoadingStatus(userId, false)
            enqueueSnackbar('Could not unfollow user', { variant: 'error' })
        })
    }

    useEffect(() => {
        if (usersWhoLikedComment.error) {
            enqueueSnackbar('Comment likes could not be retrieved', { variant: 'error' })
        }
    }, [usersWhoLikedComment.error])

    const handleCloseUserLikesModal = () => setIsUserLikesModalOpen(false)

    return (
        <Box
            component='ul'
            fontSize='100%'
            margin='0'
            border='0'
            padding='0'
            display='block'
            sx={{ verticalAlign: 'baseline', listStyleType: 'none' }}
            {...!props.dense && { marginBottom: '16px' }}
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
                    paddingTop='12px'
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
                            { props.loading ? (
                                <Skeleton
                                    component='div'
                                    animation='wave'
                                    variant='circular'
                                    width='40px'
                                    height='40px'
                                    sx={{ backgroundColor: '#262626' }} />
                            ) : (
                                <UserAvatar
                                    size={40}
                                    fontSize={16}
                                    firstName={props.comment.user.firstName}
                                    lastName={props.comment.user.lastName} />
                            )}
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
                                                { props.loading ? (
                                                    <Skeleton sx={{ backgroundColor: '#262626' }} animation='wave' width='340px' />
                                                ) : props.comment.user.username }
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
                                        { props.loading ? (
                                            <Skeleton sx={{ backgroundColor: '#262626' }} animation='wave' width='140px' />
                                        ) : props.comment.text }
                                    </Box>
                                </Box>
                                { !props.loading && (
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
                                            { props.comment.likesCount > 0 && (
                                                <>
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
                                                        onClick={handleViewLikingUsers}
                                                        sx={{ cursor: 'pointer' }}
                                                    >
                                                        { props.comment.likesCount } { props.comment.likesCount > 1 ? 'likes' : 'like' }
                                                    </Box>
                                                </>
                                            )}
                                        </Box>
                                    </Box>
                                )}
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
                                { !props.loading && (
                                    <LoadingIconButton
                                        color={props.comment.liked ? '#ED4956' : '#FFFFFF'}
                                        loading={props.comment.isLikedLoading}
                                        iconComponent={props.comment.liked ?
                                            <Favorite sx={{ fontSize: 16 }}/> :
                                            <FavoriteBorder sx={{ fontSize: 16 }}/>
                                        }
                                        onClick={handleLikeComment} />
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <UserLikesModal
                open={isUserLikesModalOpen}
                onCloseModal={handleCloseUserLikesModal}
                users={usersWhoLikedComment.data?.getUsersWhoLikedComment.data.map(userWhoLikedComment => ({...userWhoLikedComment,...userWhoLikedComment.followableUser,...userWhoLikedComment.followableUser.user})) ?? []}
                isInitialLoading={isInitialLoading}
                isMoreLoading={usersWhoLikedComment.loading}
                hasMoreUsers={usersWhoLikedComment.data ?
                    usersWhoLikedComment.data.getUsersWhoLikedComment.data.length < usersWhoLikedComment.data.getUsersWhoLikedComment.total : false}
                onFetchMoreUsers={handleFetchMoreUsers}
                onFollowUser={handleFollowUser}
                onUnfollowUser={handleUnfollowUser} />
        </Box>
    )
}