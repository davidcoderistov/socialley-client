import { useMutation } from '@apollo/client'
import { useLoggedInUser } from '../../misc'
import { useSnackbar } from 'notistack'
import { LIKE_POST } from '../../../graphql/mutations/posts'
import { useUpdatePostDetailsLikedLoadingStatus } from './useUpdatePostDetailsLikedLoadingStatus'
import { useUpdatePostDetailsLikedStatus } from './useUpdatePostDetailsLikedStatus'
import { useUpdatePostAddLikingUser } from './useUpdatePostAddLikingUser'


export function useLikePost () {

    const [loggedInUser] = useLoggedInUser()
    const { enqueueSnackbar } = useSnackbar()

    const [likePost] = useMutation(LIKE_POST)

    const updatePostDetailsLikedLoadingStatus = useUpdatePostDetailsLikedLoadingStatus()
    const updatePostDetailsLikedStatus = useUpdatePostDetailsLikedStatus()
    const updatePostAddLikingUser = useUpdatePostAddLikingUser()

    return (postId: string) => {
        updatePostDetailsLikedLoadingStatus(postId, true)
        likePost({
            variables: {
                postId
            }
        }).then(() => {
            updatePostAddLikingUser(postId)
            updatePostDetailsLikedStatus(postId, true, loggedInUser)
        }).catch(() => {
            updatePostDetailsLikedLoadingStatus(postId, false)
            enqueueSnackbar(`Could not like this post`, { variant: 'error' })
        })
    }
}

