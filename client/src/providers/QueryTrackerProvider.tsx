import React, { createContext, useRef } from 'react'


interface Variables {
    [key: string]: any
}

interface KeyVariable {
    name: string
    value: string
}

const getKey = (queryName: string, variables: Variables) => {
    const variablesKey = Object.keys(variables).sort().map(key => {
        const value = variables[key]
        return `${key}:${value}`
    }).join('-')

    return `${queryName}/${variablesKey}`
}

const keyMatches = (key: string, queryName: string, keyVariable: KeyVariable) => {
    const queryParts = key.split('/')
    if (queryParts.length > 0) {
        const qn = queryParts[0]
        if (queryParts.length > 1) {
            const variablesKey = queryParts[1].split('-')
            return qn === queryName && variablesKey.some(variableKey => {
                const [key, value] = variableKey.split(':')
                return key === keyVariable.name && value === keyVariable.value
            })
        }
        return qn === queryName
    }
    return false
}

interface QueryTrackerContextI {
    trackQueryEntry: (queryName: string, variables: Variables) => void
    hasQueryEntry: (queryName: string, variables: Variables) => boolean
    untrackQuery: (queryName: string, keyVariable: KeyVariable) => void
    clearQueryTracker: () => void
}

export const QueryTrackerContext = createContext<QueryTrackerContextI>({
    trackQueryEntry: () => {},
    hasQueryEntry: () => false,
    untrackQuery: () => {},
    clearQueryTracker: () => {},
})

export default function QueryTrackerProvider (props: { children: React.ReactNode }) {

    const queryTrackerRef = useRef(new Map<string, boolean>)

    const trackQueryEntry = (queryName: string, variables: Variables) => {
        const key = getKey(queryName, variables)
        queryTrackerRef.current.set(key, true)
    }

    const hasQueryEntry = (queryName: string, variables: Variables) => {
        const key = getKey(queryName, variables)
        return queryTrackerRef.current.has(key)
    }

    const untrackQuery = (queryName: string, keyVariable: KeyVariable) => {
        queryTrackerRef.current.forEach((value, key) => {
            if (keyMatches(key, queryName, keyVariable)) {
                queryTrackerRef.current.delete(key)
            }
        })
    }

    const clearQueryTracker = () => {
        queryTrackerRef.current = new Map()
    }

    return (
        <QueryTrackerContext.Provider value={{ trackQueryEntry, hasQueryEntry, untrackQuery, clearQueryTracker }}>
            { props.children }
        </QueryTrackerContext.Provider>
    )
}