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

export const EDIT_USER = gql`
    mutation editUser($user: EditUserOptions) {
        editUser(user: $user) {
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

export const CHANGE_PASSWORD = gql`
    mutation changePassword($changePassword: ChangePasswordOptions) {
        changePassword(changePassword: $changePassword) {
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

export const CHANGE_PROFILE_PHOTO = gql`
    mutation changePassword($photo: Upload!) {
        changeProfilePhoto(photo: $photo) {
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