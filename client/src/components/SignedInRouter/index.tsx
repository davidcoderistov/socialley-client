import React from 'react'
import AppContext from '../../config/context'
import { User } from '../../types'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from '../Dashboard'
import HomePage from '../../pages/HomePage'
import MessagesPage from '../../pages/MessagesPage'
import ProfilePage from '../../pages/ProfilePage'
import { useLatestMessages } from '../../hooks/graphql/messages'


interface SignedInRouterProps {
    loggedInUser: User,
    setLoggedInUser: (user: User | null) => void
}

export default function SignedInRouter ({ loggedInUser, setLoggedInUser }: SignedInRouterProps) {

    const [
        { latestMessages, latestMessagesCount, latestMessagesLoading},
        fetchMoreMessages
    ] = useLatestMessages({ limit: 10 })

    return (
        <AppContext.Provider value={{ loggedInUser, setLoggedInUser }}>
            <Dashboard>
                <Routes>
                    <Route path='/' element={
                        <HomePage />
                    } />
                    <Route path='/messages' element={
                        <MessagesPage
                            latestMessages={latestMessages}
                            latestMessagesCount={latestMessagesCount}
                            latestMessagesLoading={latestMessagesLoading}
                            fetchMoreMessages={fetchMoreMessages} />
                    } />
                    <Route path='/profile' element={
                        <ProfilePage />
                    } />
                    <Route path='*' element={
                        <Navigate to='/' replace />
                    } />
                </Routes>
            </Dashboard>
        </AppContext.Provider>
    )
}