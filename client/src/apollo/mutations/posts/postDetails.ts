import { GetPostDetailsQueryType } from '../../../graphql/types/queries/posts'


interface UpdatePostDetailsLikedLoadingStatusOptions {
    postDetails: GetPostDetailsQueryType
    isLikedLoading: boolean
}

export function updatePostDetailsLikedLoadingStatus (options: UpdatePostDetailsLikedLoadingStatusOptions): GetPostDetailsQueryType {
    const { postDetails, isLikedLoading } = options

    return {
        ...postDetails,
        getPostDetails: {
            ...postDetails.getPostDetails,
            isLikedLoading,
        }
    }
}

interface UpdatePostDetailsLikedStatusOptions {
    postDetails: GetPostDetailsQueryType
    liked: boolean
    firstLikeUser: {
        _id: string
        username: string
    } | null
}

export function updatePostDetailsLikedStatus (options: UpdatePostDetailsLikedStatusOptions): GetPostDetailsQueryType {
    const { postDetails, liked, firstLikeUser } = options
    return {
        ...postDetails,
        getPostDetails: {
            ...postDetails.getPostDetails,
            liked,
            firstLikeUser,
            likesCount: liked ? postDetails.getPostDetails.likesCount + 1 : postDetails.getPostDetails.likesCount - 1,
            isLikedLoading: false,
        }
    }
}

interface UpdatePostDetailsFavoriteLoadingStatusOptions {
    postDetails: GetPostDetailsQueryType
    isFavoriteLoading: boolean
}

export function updatePostDetailsFavoriteLoadingStatus (options: UpdatePostDetailsFavoriteLoadingStatusOptions): GetPostDetailsQueryType {
    const { postDetails, isFavoriteLoading } = options

    return {
        ...postDetails,
        getPostDetails: {
            ...postDetails.getPostDetails,
            isFavoriteLoading,
        }
    }
}

interface UpdatePostDetailsFavoriteStatusOptions {
    postDetails: GetPostDetailsQueryType
    favorite: boolean
}

export function updatePostDetailsFavoriteStatus (options: UpdatePostDetailsFavoriteStatusOptions): GetPostDetailsQueryType {
    const { postDetails, favorite } = options

    return {
        ...postDetails,
        getPostDetails: {
            ...postDetails.getPostDetails,
            favorite,
            isFavoriteLoading: false,
        }
    }
}