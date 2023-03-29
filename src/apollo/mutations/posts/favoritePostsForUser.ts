import { GetFavoritePostsForUserQueryType } from '../../../graphql/types/queries/posts'
import { Post } from '../../../graphql/types/models'


interface AddFavoritePostForUserOptions {
    favoritePostsForUser: GetFavoritePostsForUserQueryType
    post: Omit<Post, 'createdAt'>
}

export function addFavoritePostForUser (options: AddFavoritePostForUserOptions): GetFavoritePostsForUserQueryType {
    const { favoritePostsForUser, post } = options

    return {
        ...favoritePostsForUser,
        getFavoritePostsForUser: {
            ...favoritePostsForUser.getFavoritePostsForUser,
            data: [post, ...favoritePostsForUser.getFavoritePostsForUser.data],
            total: favoritePostsForUser.getFavoritePostsForUser.total + 1
        }
    }
}

interface RemoveFavoritePostForUserOptions {
    favoritePostsForUser: GetFavoritePostsForUserQueryType
    postId: string
}

export function removeFavoritePostForUser (options: RemoveFavoritePostForUserOptions): GetFavoritePostsForUserQueryType {
    const { favoritePostsForUser, postId } = options

    const findFavoritePostId = favoritePostsForUser.getFavoritePostsForUser.data.findIndex(post => post._id === postId)
    if (findFavoritePostId >= 0) {
        const favoritePosts = [...favoritePostsForUser.getFavoritePostsForUser.data]
        favoritePosts.splice(findFavoritePostId, 1)
        return {
            ...favoritePostsForUser,
            getFavoritePostsForUser: {
                ...favoritePostsForUser.getFavoritePostsForUser,
                data: favoritePosts,
                total: favoritePostsForUser.getFavoritePostsForUser.total - 1
            }
        }
    }
    return favoritePostsForUser
}

