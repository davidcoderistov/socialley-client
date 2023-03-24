import React from 'react'
import { createContext } from 'react'
import { User } from '../types'


export interface AppContext {
    loggedInUser: User | null
    setLoggedInUser: (user: User | null) => void
    isSuggestedUsersPageVisited: boolean
    setIsSuggestedUsersPageVisited: (visited: boolean) => void
    queryTracker: Map<string, boolean>
    setQueryTracker: React.Dispatch<React.SetStateAction<Map<string, boolean>>>
}

export default createContext<AppContext>({
    loggedInUser: null,
    setLoggedInUser: () => {},
    isSuggestedUsersPageVisited: false,
    setIsSuggestedUsersPageVisited: () => {},
    queryTracker: new Map<string, boolean>(),
    setQueryTracker: () => {},
})