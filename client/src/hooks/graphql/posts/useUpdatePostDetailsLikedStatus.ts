import { useApolloClient } from '@apollo/client'
import { GET_POST_DETAILS } from '../../../graphql/queries/posts'
import { GetPostDetailsQueryType } from '../../../graphql/types/queries/posts'
import { updatePostDetailsLikedStatus } from '../../../apollo/mutations/posts/postDetails'


export function useUpdatePostDetailsLikedStatus () {

    const client = useApolloClient()

    return (postId: string, liked: boolean, firstLikeUser: { _id: string, username: string } | null) => {
        client.cache.updateQuery({
            query: GET_POST_DETAILS,
            variables: { postId },
        }, (postDetails: GetPostDetailsQueryType | null) => {
            if (postDetails) {
                return updatePostDetailsLikedStatus({
                    postDetails,
                    liked,
                    firstLikeUser,
                })
            }
        })
    }
}