import { User, SuggestedUser, FollowingUser, FollowerUser } from '../../models'


export interface GetUsersBySearchQueryQueryType {
    getUsersBySearchQuery: Omit<User, 'email'>[]
}

export interface GetSuggestedUsersQueryType {
    getSuggestedUsers: SuggestedUser[]
}

export interface GetFollowingForUserQueryType {
    getFollowingForUser: FollowingUser[]
}

export interface GetFollowersForUserQueryType {
    getFollowersForUser: FollowerUser[]
}