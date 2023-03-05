import { useLazyQuery, useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { GET_FIRST_USER_WHO_LIKED_POST } from '../../../graphql/queries/posts'
import { GetFirstUserWhoLikedPostQueryType } from '../../../graphql/types/queries/posts'
import { UNLIKE_POST } from '../../../graphql/mutations/posts'
import { useUpdatePostDetailsLikedLoadingStatus } from './useUpdatePostDetailsLikedLoadingStatus'
import { useUpdatePostDetailsLikedStatus } from './useUpdatePostDetailsLikedStatus'
import { useUpdatePostRemoveLikingUser } from './useUpdatePostRemoveLikingUser'
import { PostDetails } from '../../../types'


export function useUnlikePost () {

    const { enqueueSnackbar } = useSnackbar()

    const [getFirstLikingUser] = useLazyQuery<GetFirstUserWhoLikedPostQueryType>(GET_FIRST_USER_WHO_LIKED_POST)

    const [unlikePost] = useMutation(UNLIKE_POST)

    const updatePostDetailsLikedLoadingStatus = useUpdatePostDetailsLikedLoadingStatus()
    const updatePostDetailsLikedStatus = useUpdatePostDetailsLikedStatus()
    const updatePostRemoveLikingUser = useUpdatePostRemoveLikingUser()

    return (postId: string, postDetails: PostDetails) => {
        updatePostDetailsLikedLoadingStatus(postId, true)
        unlikePost({
            variables: {
                postId
            }
        }).then(() => {
            const usersWhoLikedPost = updatePostRemoveLikingUser(postId)
            if (usersWhoLikedPost) {
                updatePostDetailsLikedStatus(
                    postId,
                    false,
                    usersWhoLikedPost.getUsersWhoLikedPost.data.length > 0 ?
                        usersWhoLikedPost.getUsersWhoLikedPost.data[0].followableUser.user : null
                )
            } else {
                if (postDetails && postDetails.likesCount > 1) {
                    return getFirstLikingUser({ variables: { postId }}).then(({ data }) => {
                        const firstLikingUser = data?.getFirstUserWhoLikedPost ?? null
                        updatePostDetailsLikedStatus(postId, false, firstLikingUser)
                    }).catch(() => {
                        updatePostDetailsLikedStatus(postId, false, null)
                    })
                }
                updatePostDetailsLikedStatus(postId, false, null)
            }
        }).catch(() => {
            updatePostDetailsLikedLoadingStatus(postId, false)
            enqueueSnackbar(`Could not unlike this post`, { variant: 'error' })
        })
    }
}