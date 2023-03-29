import { useApolloClient } from '@apollo/client'
import { useLoggedInUser } from '../../misc'
import { GET_USERS_WHO_LIKED_POST } from '../../../graphql/queries/posts'
import { GetUsersWhoLikedPostQueryType } from '../../../graphql/types/queries/posts'
import { removeUserWhoLikedPost } from '../../../apollo/mutations/posts/usersWhoLikedPost'


export function useUpdatePostRemoveLikingUser () {

    const client = useApolloClient()

    const [loggedInUser] = useLoggedInUser()

    return (postId: string): GetUsersWhoLikedPostQueryType | null => {
        let usersWhoLikedPostResult = null
        client.cache.updateQuery({
            query: GET_USERS_WHO_LIKED_POST,
            variables: { postId }
        }, (usersWhoLikedPost: GetUsersWhoLikedPostQueryType | null) => {
            if (usersWhoLikedPost) {
                usersWhoLikedPostResult = usersWhoLikedPost
                const result = removeUserWhoLikedPost({
                    usersWhoLikedPost,
                    userId: loggedInUser._id
                })
                if (result.success) {
                    usersWhoLikedPostResult = result.usersWhoLikedPost
                    return result.usersWhoLikedPost
                }
            }
        })
        return usersWhoLikedPostResult
    }
}