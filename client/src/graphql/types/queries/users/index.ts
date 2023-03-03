import { User, SuggestedUser, FollowingUser, FollowerUser, UserDetails } from '../../models'


export interface GetUsersBySearchQueryQueryType {
    getUsersBySearchQuery: Omit<User, 'email'>[]
}

export interface GetSuggestedUsersQueryType {
    getSuggestedUsers: SuggestedUser[]
}

export interface GetFollowingForUserQueryType {
    getFollowingForUser: {
        data: FollowingUser[]
        total: number
    }
}

export interface GetFollowersForUserQueryType {
    getFollowersForUser: {
        data: FollowerUser[]
        total: number
    }
}

export interface GetUserDetailsQueryType {
    getUserDetails: UserDetails
}