import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from '../Dashboard'
import HomePage from '../../pages/HomePage'
import MessagesPage from '../../pages/MessagesPage'
import ProfilePage from '../../pages/ProfilePage'
import { useLatestMessages, useReceiveMessage } from '../../hooks/graphql/messages'


export default function SignedInRouter () {

    useReceiveMessage()

    const [
        { latestMessages, latestMessagesCount, hasMoreLatestMessages, latestMessagesLoading},
        fetchMoreMessages
    ] = useLatestMessages({ limit: 10 })

    return (
        <Dashboard>
            <Routes>
                <Route path='/' element={
                    <HomePage />
                } />
                <Route path='/messages' element={
                    <MessagesPage
                        latestMessages={latestMessages}
                        latestMessagesCount={latestMessagesCount}
                        hasMoreLatestMessages={hasMoreLatestMessages}
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
    )
}