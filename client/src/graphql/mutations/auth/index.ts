import { gql } from '@apollo/client'


export const SIGN_UP = gql`
    mutation signUp($user: SignUpOptions) {
        signUp(user: $user) {
            _id
        }
    }
`

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

export const LOGOUT = gql`
    mutation logout {
        logout {
            _id
            username
        }
    }
`