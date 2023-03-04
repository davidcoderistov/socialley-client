import { useApolloClient } from '@apollo/client'
import { useLoggedInUser } from '../../misc'
import { GET_USERS_WHO_LIKED_COMMENT } from '../../../graphql/queries/posts'
import { GetUsersWhoLikedCommentQueryType } from '../../../graphql/types/queries/posts'
import { addUserWhoLikedComment } from '../../../apollo/mutations/posts/usersWhoLikedComment'


export function useUpdateCommentAddLikingUser () {

    const client = useApolloClient()

    const [loggedInUser] = useLoggedInUser()

    return (commentId: string) => {
        client.cache.updateQuery({
            query: GET_USERS_WHO_LIKED_COMMENT,
            variables: { commentId }
        }, (usersWhoLikedComment: GetUsersWhoLikedCommentQueryType | null) => {
            if (usersWhoLikedComment) {
                return addUserWhoLikedComment({
                    usersWhoLikedComment,
                    userWhoLikedComment: {
                        followableUser: {
                            user: loggedInUser,
                            following: true,
                        },
                        isFollowingLoading: false,
                    }
                }).usersWhoLikedComment
            }
        })
    }
}