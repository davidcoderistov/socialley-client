import { useApolloClient } from '@apollo/client'
import { GET_FOLLOWED_USERS_POSTS } from '../../../graphql/queries/posts'
import { GetFollowedUsersPostsQueryType } from '../../../graphql/types/queries/posts'
import { removeFollowedUserPost } from '../../../apollo/mutations/posts/followedUsersPosts'


export function useRemoveFollowedUserPost () {

    const client = useApolloClient()

    return (userId: string) => {
        client.cache.updateQuery(
            { query: GET_FOLLOWED_USERS_POSTS },
            (followedUsersPosts: GetFollowedUsersPostsQueryType | null) => {
                if (followedUsersPosts) {
                    return removeFollowedUserPost({
                        followedUsersPosts,
                        userId,
                    }).followedUsersPosts
                }
            }
        )
    }
}