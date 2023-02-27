import { User, SuggestedUser } from '../../models'


export interface GetUsersBySearchQueryQueryType {
    getUsersBySearchQuery: Omit<User, 'email'>[]
}

export interface GetSuggestedUsersQueryType {
    getSuggestedUsers: SuggestedUser[]
}