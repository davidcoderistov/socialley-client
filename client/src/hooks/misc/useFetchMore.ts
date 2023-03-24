import { useContext } from 'react'
import { QueryResult } from '@apollo/client'
import AppContext from '../../config/context'


const generateUniqueKey = (queryName: string, variables: { [key:string]: any } = {}) => {
    const variablesKey = Object.keys(variables).sort().map(key => {
        const value = variables[key]
        return `${key}-${value}`
    }).join(':')

    return `${queryName}-${variablesKey}`
}

export const useFetchMore = <T>(
    { queryName, queryResult, updateQuery }: {
        queryName: string,
        queryResult: QueryResult<T>,
        updateQuery: (existing: T, incoming: T) => T,
    }
) => {

    const { queryTracker, setQueryTracker } = useContext(AppContext)

    return (fetchMoreArgs: {
        variables: { [key: string]: any }
        onStart?: () => void
        onSuccess?: () => void
        onError?: () => void
        onFinally?: () => void
    }) => {

        const key = generateUniqueKey(queryName, fetchMoreArgs.variables)
        if (!queryTracker.has(key)) {
            setQueryTracker(queryTracker => new Map(queryTracker).set(key, true))
            fetchMoreArgs.onStart?.()
            queryResult.fetchMore({
                variables: fetchMoreArgs.variables,
                updateQuery: (existing, { fetchMoreResult }: { fetchMoreResult: T }) => updateQuery(existing, fetchMoreResult)
            })
                .then(() => {
                    fetchMoreArgs.onSuccess?.()
                })
                .catch(() => {
                    fetchMoreArgs.onError?.()
                })
                .finally(() => {
                    fetchMoreArgs.onFinally?.()
                })
        }
    }
}