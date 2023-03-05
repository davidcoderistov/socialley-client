import { GetPostsForUserQueryType } from '../../../graphql/types/queries/posts'
import { Post } from '../../../graphql/types/models'


interface AddPostForUserOptions {
    postsForUser: GetPostsForUserQueryType
    post: Omit<Post, 'createdAt'>
}

export function addPostForUser (options: AddPostForUserOptions): GetPostsForUserQueryType {
    const { postsForUser, post } = options

    return {
        ...postsForUser,
        getPostsForUser: {
            ...postsForUser.getPostsForUser,
            data: [post, ...postsForUser.getPostsForUser.data],
            total: postsForUser.getPostsForUser.total + 1
        }
    }
}

