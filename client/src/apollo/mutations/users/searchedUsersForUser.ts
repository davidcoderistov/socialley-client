import { GetSearchedUsersForUserQueryType } from '../../../graphql/types/queries/users'
import { User } from '../../../graphql/types/models'


interface AddSearchedUserOptions {
    searchedUsersForUser: GetSearchedUsersForUserQueryType
    searchedUser: Omit<User, 'email'>
}

export function addSearchedUser (options: AddSearchedUserOptions): GetSearchedUsersForUserQueryType {
    const { searchedUsersForUser, searchedUser } = options

    return {
        ...searchedUsersForUser,
        getSearchedUsersForUser: [
            searchedUser,
            ...searchedUsersForUser.getSearchedUsersForUser.findIndex(user => user._id === searchedUser._id) >= 0 ?
                searchedUsersForUser.getSearchedUsersForUser.filter(user => user._id !== searchedUser._id) :
                    searchedUsersForUser.getSearchedUsersForUser.length >= 10 ?
                        searchedUsersForUser.getSearchedUsersForUser.slice(0, 9) : searchedUsersForUser.getSearchedUsersForUser
        ]
    }
}

interface RemoveSearchedUserOptions {
    searchedUsersForUser: GetSearchedUsersForUserQueryType
    userId: string
}

export function removeSearchedUser (options: RemoveSearchedUserOptions): GetSearchedUsersForUserQueryType {
    const { searchedUsersForUser, userId } = options

    return {
        ...searchedUsersForUser,
        getSearchedUsersForUser: searchedUsersForUser.getSearchedUsersForUser
            .filter(searchedUser => searchedUser._id !== userId)
    }
}