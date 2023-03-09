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

export default {
    updateFollowingLoadingStatus,
    updateFollowingStatus,
}