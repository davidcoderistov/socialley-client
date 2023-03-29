import { useApolloClient } from '@apollo/client'
import { GET_POST_DETAILS } from '../../../graphql/queries/posts'
import { GetPostDetailsQueryType } from '../../../graphql/types/queries/posts'
import { updatePostDetailsFavoriteStatus } from '../../../apollo/mutations/posts/postDetails'


export function useUpdatePostDetailsFavoriteStatus () {

    const client = useApolloClient()

    return (postId: string, favorite: boolean) => {
        client.cache.updateQuery({
            query: GET_POST_DETAILS,
            variables: { postId },
        }, (postDetails: GetPostDetailsQueryType | null) => {
            if (postDetails) {
                return updatePostDetailsFavoriteStatus({
                    postDetails,
                    favorite,
                })
            }
        })
    }
}