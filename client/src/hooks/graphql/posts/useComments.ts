import { useQuery } from '@apollo/client'
import { GET_COMMENTS_FOR_POST } from '../../../graphql/queries/posts'
import { GetCommentsForPostQueryType } from '../../../graphql/types/queries/posts'


export function useComments ({ postId }: { postId: string | null }) {

    const commentsForPost = useQuery<GetCommentsForPostQueryType>(GET_COMMENTS_FOR_POST, {
        variables: {
            postId,
            offset: 0,
            limit: 10,
        },
        skip: !postId,
        notifyOnNetworkStatusChange: true,
    })

    const fetchMoreComments = () => {
        const commentsForPostData = commentsForPost.data as GetCommentsForPostQueryType
        commentsForPost.fetchMore({
            variables: { postId, offset: commentsForPostData.getCommentsForPost.data.length },
            updateQuery (existing, { fetchMoreResult }: { fetchMoreResult: GetCommentsForPostQueryType }) {
                return {
                    ...existing,
                    getCommentsForPost: {
                        ...existing.getCommentsForPost,
                        data: [
                            ...existing.getCommentsForPost.data,
                            ...fetchMoreResult.getCommentsForPost.data,
                        ]
                    }
                }
            }
        }).catch(console.log)
    }

    const hasMoreComments = commentsForPost.data ?
        commentsForPost.data.getCommentsForPost.data.length < commentsForPost.data.getCommentsForPost.total : false

    return {
        commentsForPost,
        fetchMoreComments,
        hasMoreComments,
    }
}