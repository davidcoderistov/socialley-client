import { useApolloClient } from '@apollo/client'
import { useLoggedInUser } from '../../misc'
import { GET_USERS_WHO_LIKED_POST } from '../../../graphql/queries/posts'
import { GetUsersWhoLikedPostQueryType } from '../../../graphql/types/queries/posts'
import { addUserWhoLikedPost } from '../../../apollo/mutations/posts/usersWhoLikedPost'


export function useUpdatePostAddLikingUser () {

    const client = useApolloClient()

    const [loggedInUser] = useLoggedInUser()

    return (postId: string) => {
        client.cache.updateQuery({
            query: GET_USERS_WHO_LIKED_POST,
            variables: { postId }
        }, (usersWhoLikedPost: GetUsersWhoLikedPostQueryType | null) => {
            if (usersWhoLikedPost) {
                return addUserWhoLikedPost({
                    usersWhoLikedPost,
                    userWhoLikedPost: {
                        followableUser: {
                            user: loggedInUser,
                            following: true,
                        },
                        isFollowingLoading: false,
                    }
                }).usersWhoLikedPost
            }
        })
    }
}
