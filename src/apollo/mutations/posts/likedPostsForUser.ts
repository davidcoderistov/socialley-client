import { GetLikedPostsForUserQueryType } from '../../../graphql/types/queries/posts'
import { Post } from '../../../graphql/types/models'


interface AddLikedPostForUserOptions {
    likedPostsForUser: GetLikedPostsForUserQueryType
    post: Omit<Post, 'createdAt'>
}

export function addLikedPostForUser (options: AddLikedPostForUserOptions): GetLikedPostsForUserQueryType {
    const { likedPostsForUser, post } = options

    return {
        ...likedPostsForUser,
        getLikedPostsForUser: {
            ...likedPostsForUser.getLikedPostsForUser,
            data: [post, ...likedPostsForUser.getLikedPostsForUser.data],
            total: likedPostsForUser.getLikedPostsForUser.total + 1
        }
    }
}

interface RemoveLikedPostForUserOptions {
    likedPostsForUser: GetLikedPostsForUserQueryType
    postId: string
}

export function removeLikedPostForUser (options: RemoveLikedPostForUserOptions): GetLikedPostsForUserQueryType {
    const { likedPostsForUser, postId } = options

    const findLikedPostId = likedPostsForUser.getLikedPostsForUser.data.findIndex(post => post._id === postId)
    if (findLikedPostId >= 0) {
        const likedPosts = [...likedPostsForUser.getLikedPostsForUser.data]
        likedPosts.splice(findLikedPostId, 1)
        return {
            ...likedPostsForUser,
            getLikedPostsForUser: {
                ...likedPostsForUser.getLikedPostsForUser,
                data: likedPosts,
                total: likedPostsForUser.getLikedPostsForUser.total - 1
            }
        }
    }
    return likedPostsForUser
}

