import { User, SuggestedUser, FollowableUser } from '../../models'


export interface GetUsersBySearchQueryQueryType {
    getUsersBySearchQuery: Omit<User, 'email'>[]
}

export interface GetSuggestedUsersQueryType {
    getSuggestedUsers: SuggestedUser[]
}

export interface GetFollowingForUserQueryType {
    getFollowingForUser: FollowableUser[]
}

export interface GetFollowersForUserQueryType {
    getFollowersForUser: FollowableUser[]
}