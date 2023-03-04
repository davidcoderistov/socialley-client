import { useMutation } from '@apollo/client'
import { useUpdateCommentLikedLoadingStatus } from './useUpdateCommentLikedLoadingStatus'
import { useUpdateCommentLikedStatus } from './useUpdateCommentLikedStatus'
import { useUpdateCommentRemoveLikingUser } from './useUpdateCommentRemoveLikingUser'
import { useSnackbar } from 'notistack'
import { UNLIKE_COMMENT } from '../../../graphql/mutations/posts'


export function useUnlikeComment () {

    const updateCommentLikedLoadingStatus = useUpdateCommentLikedLoadingStatus()
    const updateCommentLikedStatus = useUpdateCommentLikedStatus()
    const updateCommentRemoveLikingUser = useUpdateCommentRemoveLikingUser()

    const [unlikeComment] = useMutation(UNLIKE_COMMENT)

    const { enqueueSnackbar } = useSnackbar()

    return (commentId: string, postId: string) => {
        updateCommentLikedLoadingStatus(commentId, postId, true)
        unlikeComment({
            variables: { commentId }
        }).then(() => {
            updateCommentRemoveLikingUser(commentId)
            updateCommentLikedStatus(commentId, postId, false)
        }).catch(() => {
            updateCommentLikedLoadingStatus(commentId, postId, false)
            enqueueSnackbar(`Could not unlike this comment`, { variant: 'error' })
        })
    }
}