import { User, AuthUser } from '../../models'


export interface SignUpMutationType {
    signUp: Pick<User, '_id'>
}

export interface LoginMutationType {
    login: AuthUser
}

export interface RefreshMutationType {
    refresh: AuthUser
}

export interface LogoutMutationType {
    logout: Pick<User, '_id' | 'username'>
}

export interface EditUserMutationType {
    editUser: AuthUser
}

export interface ChangePasswordMutationType {
    changePassword: AuthUser
}

export interface ChangeProfilePhotoMutationType {
    changeProfilePhoto: AuthUser
}