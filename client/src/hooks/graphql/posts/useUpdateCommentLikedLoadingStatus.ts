import { useApolloClient } from '@apollo/client'
import { GET_COMMENTS_FOR_POST } from '../../../graphql/queries/posts'
import { GetCommentsForPostQueryType } from '../../../graphql/types/queries/posts'
import { updateCommentLikedLoadingStatus } from '../../../apollo/mutations/posts/commentsForPost'


export function useUpdateCommentLikedLoadingStatus () {

    const client = useApolloClient()

    return (commentId: string, postId: string, isLikedLoading: boolean) => {
        client.cache.updateQuery({
            query: GET_COMMENTS_FOR_POST,
            variables: { postId }
        }, (commentsForPost: GetCommentsForPostQueryType | null) => {
            if (commentsForPost) {
                return updateCommentLikedLoadingStatus({
                    commentsForPost,
                    commentId,
                    isLikedLoading,
                }).commentsForPost
            }
        })
    }
}


