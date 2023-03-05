import { useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { MARK_USER_POST_AS_FAVORITE } from '../../../graphql/mutations/posts'
import { useUpdatePostDetailsFavoriteLoadingStatus } from './useUpdatePostDetailsFavoriteLoadingStatus'
import { useUpdatePostDetailsFavoriteStatus } from './useUpdatePostDetailsFavoriteStatus'
import { useAddFavoritePostForUser } from './useAddFavoritePostForUser'
import { PostDetails } from '../../../types'


export function useMarkPostAsFavorite () {

    const { enqueueSnackbar } = useSnackbar()

    const [markPostAsFavorite] = useMutation(MARK_USER_POST_AS_FAVORITE)

    const updatePostDetailsFavoriteLoadingStatus = useUpdatePostDetailsFavoriteLoadingStatus()
    const updatePostDetailsFavoriteStatus = useUpdatePostDetailsFavoriteStatus()
    const addFavoritePostForUser = useAddFavoritePostForUser()

    return (postId: string, postDetails: PostDetails) => {
        updatePostDetailsFavoriteLoadingStatus(postId, true)
        markPostAsFavorite({
            variables: {
                postId
            }
        }).then(() => {
            updatePostDetailsFavoriteStatus(postId, true)
            addFavoritePostForUser({
                _id: postDetails._id,
                title: postDetails.title,
                photoURL: postDetails.photoURL,
                videoURL: postDetails.videoURL,
            })
        }).catch(() => {
            updatePostDetailsFavoriteLoadingStatus(postId, false)
            enqueueSnackbar(`Could not mark this post as favorite`, { variant: 'error' })
        })
    }
}