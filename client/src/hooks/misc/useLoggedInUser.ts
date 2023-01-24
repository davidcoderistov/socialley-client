import { useContext } from 'react'
import AppContext from '../../config/context'
import { User } from '../../types'


export function useLoggedInUser () {

    const context = useContext(AppContext)
    const loggedInUser = context.loggedInUser as User

    return [loggedInUser] as const
}