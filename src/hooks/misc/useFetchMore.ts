import { useContext } from 'react'
import { QueryResult } from '@apollo/client'
import { QueryTrackerContext } from '../../providers/QueryTrackerProvider'


export const useFetchMore = <T>(
    { queryName, queryResult, updateQuery }: {
        queryName: string,
        queryResult: QueryResult<T>,
        updateQuery: (existing: T, incoming: T) => T,
    }
) => {

    const { trackQueryEntry, hasQueryEntry } = useContext(QueryTrackerContext)

    return (fetchMoreArgs: {
        variables: { [key: string]: any }
        keyVariables?: { [key: string]: any }
        onStart?: () => void
        onSuccess?: () => void
        onError?: () => void
        onFinally?: () => void
    }) => {
        const keyVariables = fetchMoreArgs.keyVariables || {}
        const queryVariables = {
            ...fetchMoreArgs.variables,
            ...keyVariables
        }
        if (!hasQueryEntry(queryName, queryVariables)) {
            trackQueryEntry(queryName, queryVariables)
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