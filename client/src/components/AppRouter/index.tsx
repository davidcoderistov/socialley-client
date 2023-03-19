import React, { useState, useEffect } from 'react'
import AppContext from '../../config/context'
import { User } from '../../types'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import {
    REFRESH,
    LOGOUT,
} from '../../graphql/mutations/auth'
import {
    RefreshMutationType,
    LogoutMutationType
} from '../../graphql/types/mutations/auth'
import { setStorageLoggedInUser } from '../../localStorage'
import { isInvalidSessionError } from '../../utils'
import SignedInRouter from '../SignedInRouter'
import LoginPage from '../../pages/LoginPage'
import SignUpPage from '../../pages/SignUpPage'
import SessionModal from '../SessionModal'


export default function AppRouter () {

    const [loggedInUser, setUser] = useState<User | null>(null)
    const [isSuggestedUsersPageVisited, setIsSuggestedUsersPageVisited] = useState(false)
    const [sessionModalOpen, setSessionModalOpen] = useState(false)

    const [refresh] = useMutation<RefreshMutationType>(REFRESH)
    const [logout] = useMutation<LogoutMutationType>(LOGOUT)

    const [loadingInitialUser, setLoadingInitialUser] = useState(false)
    const [refreshingSession, setRefreshingSession] = useState(false)
    const [invalidatingSession, setInvalidatingSession] = useState(false)
    const [sessionModalTimeout, setSessionModalTimeout] = useState<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        const getInitialUser = async () => {
            setLoadingInitialUser(true)
            try {
                const user: { data?: RefreshMutationType | null } = await refresh()
                if (user.data) {
                    setLoggedInUser(getRefreshUser(user.data))
                }
            } catch (err) {

            } finally {
                setLoadingInitialUser(false)
            }
        }
        getInitialUser()
    }, [])

    const setLoggedInUser = (user: User | null) => {
        setStorageLoggedInUser(user)
        setUser(user)
    }

    useEffect(() => {
        /*if (loggedInUser) {
            setSessionModalTimeout(setTimeout(() => {
                setSessionModalOpen(true)
            }, 5000))
        }*/
    }, [loggedInUser])

    const getRefreshUser = (data: RefreshMutationType): User => {
        return {
            _id: data.refresh.user._id,
            firstName: data.refresh.user.firstName,
            lastName: data.refresh.user.lastName,
            username: data.refresh.user.username,
            email: data.refresh.user.email,
            avatarURL: data.refresh.user.avatarURL,
            accessToken: data.refresh.accessToken,
        }
    }

    const refreshSession = async () => {
        setRefreshingSession(true)
        try {
            const user: { data?: RefreshMutationType | null } = await refresh()
            if (user.data) {
                setLoggedInUser(getRefreshUser(user.data))
            }
        } catch (err) {
            if (isInvalidSessionError(err)) {
                setLoggedInUser(null)
            } else {
                await invalidateSession()
            }
        } finally {
            setRefreshingSession(false)
            setSessionModalOpen(false)
        }
    }

    const invalidateSession = async () => {
        setInvalidatingSession(true)
        try {
            await logout()
            setLoggedInUser(null)
        } catch (err) {
            if (isInvalidSessionError(err)) {
                setLoggedInUser(null)
            } else {
                console.error(err)
            }
        } finally {
            setInvalidatingSession(false)
            setSessionModalOpen(false)
        }
    }

    const handleRefreshSession = () => {
        refreshSession()
    }

    const handleInvalidateSession = () => {
        invalidateSession()
    }

    const handleLogout = () => {
        setLoggedInUser(null)
        if (sessionModalTimeout) {
            clearTimeout(sessionModalTimeout)
        }
    }

    return (
        <>
            { loadingInitialUser ? (
                <div>
                    LOADING
                </div>
            ) : loggedInUser ? (
                <AppContext.Provider value={{ loggedInUser, setLoggedInUser, isSuggestedUsersPageVisited, setIsSuggestedUsersPageVisited }}>
                    <SignedInRouter />
                </AppContext.Provider>
            ) : (
                <AppContext.Provider value={{ loggedInUser, setLoggedInUser, isSuggestedUsersPageVisited, setIsSuggestedUsersPageVisited }}>
                    <Routes>
                        <Route path='/login' element={
                            <LoginPage />
                        } />
                        <Route path='/signup' element={
                            <SignUpPage />
                        } />
                        <Route path='*' element={
                            <Navigate to='/login' replace />
                        } />
                    </Routes>
                </AppContext.Provider>
            )}
            <SessionModal
                open={sessionModalOpen}
                refreshingSession={refreshingSession}
                invalidatingSession={invalidatingSession}
                onRefreshSession={handleRefreshSession}
                onInvalidateSession={handleInvalidateSession} />
        </>
    )
}