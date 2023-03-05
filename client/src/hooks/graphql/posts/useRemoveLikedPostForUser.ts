import { useApolloClient } from '@apollo/client'
import { GET_LIKED_POSTS_FOR_USER } from '../../../graphql/queries/posts'
import { GetLikedPostsForUserQueryType } from '../../../graphql/types/queries/posts'
import { removeLikedPostForUser } from '../../../apollo/mutations/posts/likedPostsForUser'


export function useRemoveLikedPostForUser () {

    const client = useApolloClient()

    return (postId: string) => {
        client.cache.updateQuery({
            query: GET_LIKED_POSTS_FOR_USER
        }, (likedPostsForUser: GetLikedPostsForUserQueryType | null) => {
            if (likedPostsForUser) {
                return removeLikedPostForUser({
                    likedPostsForUser,
                    postId,
                })
            }
        })
    }
}