import { useMutation } from '@apollo/client'
import { useUpdateCommentLikedLoadingStatus } from './useUpdateCommentLikedLoadingStatus'
import { useUpdateCommentLikedStatus } from './useUpdateCommentLikedStatus'
import { useUpdateCommentAddLikingUser } from './useUpdateCommentAddLikingUser'
import { useSnackbar } from 'notistack'
import { LIKE_COMMENT } from '../../../graphql/mutations/posts'


export function useLikeComment () {

    const updateCommentLikedLoadingStatus = useUpdateCommentLikedLoadingStatus()
    const updateCommentLikedStatus = useUpdateCommentLikedStatus()
    const updateCommentAddLikingUser = useUpdateCommentAddLikingUser()

    const [likeComment] = useMutation(LIKE_COMMENT)

    const { enqueueSnackbar } = useSnackbar()

    return (commentId: string, postId: string) => {
        updateCommentLikedLoadingStatus(commentId, postId, true)
        likeComment({
            variables: { commentId }
        }).then(() => {
            updateCommentAddLikingUser(commentId)
            updateCommentLikedStatus(commentId, postId, true)
        }).catch(() => {
            updateCommentLikedLoadingStatus(commentId, postId, false)
            enqueueSnackbar(`Could not like this comment`, { variant: 'error' })
        })
    }
}