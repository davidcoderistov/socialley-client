import { gql } from '@apollo/client'
import { User, AuthUser } from '../../types/user'


export interface SignUpMutationType {
    signUp: Pick<User, '_id'>
}

export const SIGN_UP = gql`
    mutation signUp($user: SignUpOptions) {
        signUp(user: $user) {
            _id
        }
    }
`

export interface LoginMutationType {
    login: AuthUser
}

export const LOGIN = gql`
    mutation login($user: LoginOptions) {
        login(user: $user) {
            user {
                _id
                firstName
                lastName
                username
                email
                avatarURL
            }
            accessToken
        }
    }
`

export interface RefreshMutationType {
    refresh: AuthUser
}

export const REFRESH = gql`
    mutation refresh {
        refresh {
            user {
                _id
                firstName
                lastName
                username
                email
                avatarURL
            }
            accessToken
        }
    }
`

export interface LogoutMutationType {
    logout: Pick<User, '_id' | 'username'>
}

export const LOGOUT = gql`
    mutation logout {
        logout {
            _id
            username
        }
    }
`