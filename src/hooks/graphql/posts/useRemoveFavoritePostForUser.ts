import { useApolloClient } from '@apollo/client'
import { GET_FAVORITE_POSTS_FOR_USER } from '../../../graphql/queries/posts'
import { GetFavoritePostsForUserQueryType } from '../../../graphql/types/queries/posts'
import { removeFavoritePostForUser } from '../../../apollo/mutations/posts/favoritePostsForUser'


export function useRemoveFavoritePostForUser () {

    const client = useApolloClient()

    return (postId: string) => {
        client.cache.updateQuery({
            query: GET_FAVORITE_POSTS_FOR_USER
        }, (favoritePostsForUser: GetFavoritePostsForUserQueryType | null) => {
            if (favoritePostsForUser) {
                return removeFavoritePostForUser({
                    favoritePostsForUser,
                    postId,
                })
            }
        })
    }
}