import { useApolloClient } from '@apollo/client'
import { GET_COMMENTS_FOR_POST } from '../../../graphql/queries/posts'
import { GetCommentsForPostQueryType } from '../../../graphql/types/queries/posts'
import { updateCommentLikedStatus } from '../../../apollo/mutations/posts/commentsForPost'


export function useUpdateCommentLikedStatus () {

    const client = useApolloClient()

    return (commentId: string, postId: string, liked: boolean) => {
        client.cache.updateQuery({
            query: GET_COMMENTS_FOR_POST,
            variables: { postId }
        }, (commentsForPost: GetCommentsForPostQueryType | null) => {
            if (commentsForPost) {
                return updateCommentLikedStatus({
                    commentsForPost,
                    commentId,
                    liked,
                }).commentsForPost
            }
        })
    }
}