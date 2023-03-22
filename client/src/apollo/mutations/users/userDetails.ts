import { GetUserDetailsQueryType } from '../../../graphql/types/queries/users'


interface UpdateFollowingLoadingStatusOptions {
    userDetails: GetUserDetailsQueryType
    isFollowingLoading: boolean
}

export function updateFollowingLoadingStatus (options: UpdateFollowingLoadingStatusOptions): GetUserDetailsQueryType {
    const { userDetails, isFollowingLoading } = options

    return {
        ...userDetails,
        getUserDetails: {
            ...userDetails.getUserDetails,
            isFollowingLoading,
        }
    }
}

interface UpdateFollowingStatusOptions {
    userDetails: GetUserDetailsQueryType
    following: boolean
}

export function updateFollowingStatus (options: UpdateFollowingStatusOptions): GetUserDetailsQueryType {
    const { userDetails, following } = options

    return {
        ...userDetails,
        getUserDetails: {
            ...userDetails.getUserDetails,
            followableUser: {
                ...userDetails.getUserDetails.followableUser,
                following,
            },
            isFollowingLoading: false,
        }
    }
}

interface IncrementFollowingCountOptions {
    userDetails: GetUserDetailsQueryType
}

export function incrementFollowingCount (options: IncrementFollowingCountOptions): GetUserDetailsQueryType {
    const { userDetails } = options

    return {
        ...userDetails,
        getUserDetails: {
            ...userDetails.getUserDetails,
            followingCount: userDetails.getUserDetails.followingCount + 1,
        }
    }
}

interface DecrementFollowingCountOptions {
    userDetails: GetUserDetailsQueryType
}

export function decrementFollowingCount (options: DecrementFollowingCountOptions): GetUserDetailsQueryType {
    const { userDetails } = options

    return {
        ...userDetails,
        getUserDetails: {
            ...userDetails.getUserDetails,
            followingCount: userDetails.getUserDetails.followingCount - 1,
        }
    }
}

interface IncrementFollowersCountOptions {
    userDetails: GetUserDetailsQueryType
}

export function incrementFollowersCount (options: IncrementFollowersCountOptions): GetUserDetailsQueryType {
    const { userDetails } = options

    return {
        ...userDetails,
        getUserDetails: {
            ...userDetails.getUserDetails,
            followersCount: userDetails.getUserDetails.followersCount + 1,
        }
    }
}

interface DecrementFollowersCountOptions {
    userDetails: GetUserDetailsQueryType
}

export function decrementFollowersCount (options: DecrementFollowersCountOptions): GetUserDetailsQueryType {
    const { userDetails } = options

    return {
        ...userDetails,
        getUserDetails: {
            ...userDetails.getUserDetails,
            followersCount: userDetails.getUserDetails.followersCount - 1,
        }
    }
}

export default {
    updateFollowingLoadingStatus,
    updateFollowingStatus,
    incrementFollowingCount,
    decrementFollowingCount,
    incrementFollowersCount,
    decrementFollowersCount,
}