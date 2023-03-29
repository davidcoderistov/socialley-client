import { useApolloClient } from '@apollo/client'
import { GET_FAVORITE_POSTS_FOR_USER } from '../../../graphql/queries/posts'
import { GetFavoritePostsForUserQueryType } from '../../../graphql/types/queries/posts'
import { addFavoritePostForUser } from '../../../apollo/mutations/posts/favoritePostsForUser'
import { Post } from '../../../graphql/types/models'


export function useAddFavoritePostForUser () {

    const client = useApolloClient()

    return (post: Omit<Post, 'createdAt'>) => {
        client.cache.updateQuery({
            query: GET_FAVORITE_POSTS_FOR_USER
        }, (favoritePostsForUser: GetFavoritePostsForUserQueryType | null) => {
            if (favoritePostsForUser) {
                return addFavoritePostForUser({
                    favoritePostsForUser,
                    post,
                })
            }
        })
    }
}