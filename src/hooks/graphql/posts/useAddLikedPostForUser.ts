import { useApolloClient } from '@apollo/client'
import { GET_LIKED_POSTS_FOR_USER } from '../../../graphql/queries/posts'
import { GetLikedPostsForUserQueryType } from '../../../graphql/types/queries/posts'
import { addLikedPostForUser } from '../../../apollo/mutations/posts/likedPostsForUser'
import { Post } from '../../../graphql/types/models'


export function useAddLikedPostForUser () {

    const client = useApolloClient()

    return (post: Omit<Post, 'createdAt'>) => {
        client.cache.updateQuery({
            query: GET_LIKED_POSTS_FOR_USER
        }, (likedPostsForUser: GetLikedPostsForUserQueryType | null) => {
            if (likedPostsForUser) {
                return addLikedPostForUser({
                    likedPostsForUser,
                    post,
                })
            }
        })
    }
}