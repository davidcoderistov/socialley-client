import { useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { MARK_USER_POST_AS_FAVORITE } from '../../../graphql/mutations/posts'
import { useUpdatePostDetailsFavoriteLoadingStatus } from './useUpdatePostDetailsFavoriteLoadingStatus'
import { useUpdatePostDetailsFavoriteStatus } from './useUpdatePostDetailsFavoriteStatus'


export function useMarkPostAsFavorite () {

    const { enqueueSnackbar } = useSnackbar()

    const [markPostAsFavorite] = useMutation(MARK_USER_POST_AS_FAVORITE)

    const updatePostDetailsFavoriteLoadingStatus = useUpdatePostDetailsFavoriteLoadingStatus()
    const updatePostDetailsFavoriteStatus = useUpdatePostDetailsFavoriteStatus()

    return (postId: string) => {
        updatePostDetailsFavoriteLoadingStatus(postId, true)
        markPostAsFavorite({
            variables: {
                postId
            }
        }).then(() => {
            updatePostDetailsFavoriteStatus(postId, true)
        }).catch(() => {
            updatePostDetailsFavoriteLoadingStatus(postId, false)
            enqueueSnackbar(`Could not mark this post as favorite`, { variant: 'error' })
        })
    }
}