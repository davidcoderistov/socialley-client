import { useApolloClient } from '@apollo/client'
import { GET_FOLLOWED_USERS_POSTS } from '../../../graphql/queries/posts'
import { GetFollowedUsersPostsQueryType } from '../../../graphql/types/queries/posts'
import { incrementFollowedUserPostCommentsCount } from '../../../apollo/mutations/posts/followedUsersPosts'


export function useUpdateFollowedUserPostCommentsCount () {

    const client = useApolloClient()

    return (postId: string) => {
        client.cache.updateQuery({
            query: GET_FOLLOWED_USERS_POSTS,
        }, (followedUsersPosts: GetFollowedUsersPostsQueryType | null) => {
            if (followedUsersPosts) {
                return incrementFollowedUserPostCommentsCount({
                    followedUsersPosts,
                    postId,
                }).followedUsersPosts
            }
        })
    }
}