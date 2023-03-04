import { useApolloClient, useMutation } from '@apollo/client'
import { useComments } from './useComments'
import { useLoggedInUser } from '../../misc'
import { useSnackbar } from 'notistack'
import { GET_COMMENTS_FOR_POST } from '../../../graphql/queries/posts'
import { GetCommentsForPostQueryType } from '../../../graphql/types/queries/posts'
import { CREATE_COMMENT } from '../../../graphql/mutations/posts'
import { CreateCommentMutationType } from '../../../graphql/types/mutations/posts'
import { addCommentForPost } from '../../../apollo/mutations/posts/commentsForPost'
import { Comment } from '../../../graphql/types/models'


export function useCreateComment ({ postId }: { postId: string | null }) {

    const client = useApolloClient()

    const { enqueueSnackbar } = useSnackbar()

    const { hasMoreComments } = useComments({ postId })

    const [loggedInUser] = useLoggedInUser()

    const [createComment, createCommentData] = useMutation<CreateCommentMutationType>(CREATE_COMMENT)

    const updateCommentsForPostAddComment = (postId: string, comment: Comment) => {
        client.cache.updateQuery({
            query: GET_COMMENTS_FOR_POST,
            variables: { postId }
        }, (commentsForPost: GetCommentsForPostQueryType | null) => {
            if (commentsForPost) {
                return addCommentForPost({
                    commentsForPost,
                    comment,
                }).commentsForPost
            }
        })
    }

    const handleCreateComment = (comment: string, onSuccess?: () => void) => {
        createComment({
            variables: {
                comment: {
                    postId,
                    text: comment,
                }
            }
        }).then(data => {
            const createComment = data.data?.createComment
            if (createComment) {
                if (!hasMoreComments) {
                    updateCommentsForPostAddComment(
                        postId as string,
                        {
                            ...createComment,
                            user: {...loggedInUser},
                            liked: false,
                            isLikedLoading: false,
                            likesCount: 0,
                        }
                    )
                }
                if (onSuccess) {
                    onSuccess()
                }
            } else {
                enqueueSnackbar(`Comment could not be posted`, { variant: 'error' })
            }
        }).catch(() => {
            enqueueSnackbar(`Comment could not be posted`, { variant: 'error' })
        })
    }

    return {
        createCommentData,
        createComment: handleCreateComment,
    }
}