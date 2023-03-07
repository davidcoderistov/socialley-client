import { GetSearchedUsersQueryType } from '../../../graphql/types/queries/users'
import { updateOneSearchedUser } from '../../utils'


interface UpdateFollowingLoadingStatusOptions {
    searchedUsers: GetSearchedUsersQueryType
    userId: string
    isFollowingLoading: boolean
}

interface UpdateFollowingLoadingStatusReturnValue {
    searchedUsers: GetSearchedUsersQueryType
    success: boolean
}

export function updateFollowingLoadingStatus (options: UpdateFollowingLoadingStatusOptions): UpdateFollowingLoadingStatusReturnValue {
    return updateOneSearchedUser({
        searchedUsers: options.searchedUsers,
        userId: options.userId,
        mapper (searchedUser) {
            return {
                ...searchedUser,
                isFollowingLoading: options.isFollowingLoading
            }
        }
    })
}

interface UpdateFollowingStatusOptions {
    searchedUsers: GetSearchedUsersQueryType
    userId: string
    following: boolean
}

interface UpdateFollowingStatusReturnValue {
    searchedUsers: GetSearchedUsersQueryType
    success: boolean
}

export function updateFollowingStatus (options: UpdateFollowingStatusOptions): UpdateFollowingStatusReturnValue {
    return updateOneSearchedUser({
        searchedUsers: options.searchedUsers,
        userId: options.userId,
        mapper (searchedUser) {
            return {
                ...searchedUser,
                followableUser: {
                    ...searchedUser.followableUser,
                    following: options.following
                },
                isFollowingLoading: false,
            }
        }
    })
}

export default {
    updateFollowingLoadingStatus,
    updateFollowingStatus,
}