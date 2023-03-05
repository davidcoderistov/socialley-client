import { useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { UNMARK_USER_POST_AS_FAVORITE } from '../../../graphql/mutations/posts'
import { useUpdatePostDetailsFavoriteLoadingStatus } from './useUpdatePostDetailsFavoriteLoadingStatus'
import { useUpdatePostDetailsFavoriteStatus } from './useUpdatePostDetailsFavoriteStatus'


export function useUnmarkPostAsFavorite () {

    const { enqueueSnackbar } = useSnackbar()

    const [unmarkPostAsFavorite] = useMutation(UNMARK_USER_POST_AS_FAVORITE)

    const updatePostDetailsFavoriteLoadingStatus = useUpdatePostDetailsFavoriteLoadingStatus()
    const updatePostDetailsFavoriteStatus = useUpdatePostDetailsFavoriteStatus()

    return (postId: string) => {
        updatePostDetailsFavoriteLoadingStatus(postId, true)
        unmarkPostAsFavorite({
            variables: {
                postId
            }
        }).then(() => {
            updatePostDetailsFavoriteStatus(postId, false)
        }).catch(() => {
            updatePostDetailsFavoriteLoadingStatus(postId, false)
            enqueueSnackbar(`Could not unmark this post as favorite`, { variant: 'error' })
        })
    }
}