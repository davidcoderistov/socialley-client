import { useState } from 'react'
import { QueryResult } from '@apollo/client'


const generateUniqueKey = (variables: { [key:string]: any } = {}) =>
    Object.keys(variables).sort().map(key => {
        const value = variables[key]
        return `${key}-${value}`
    }).join(':')

export const useFetchMore = <T>(
    { queryResult, updateQuery }: {
        queryResult: QueryResult<T>,
        updateQuery: (existing: T, incoming: T) => T,
    },
    limit: number = 10,
) => {

    const [offset, setOffset] = useState(limit)
    const [trackQuery, setTrackQuery] = useState(new Map<string, boolean>)

    const fetchMore = (fetchMoreArgs?: {
        variables?: { [key: string]: any }
        onStart?: () => void
        onSuccess?: () => void
        onError?: () => void
        onFinally?: () => void
    }) => {

        const variables = fetchMoreArgs?.variables || {}
        const key = generateUniqueKey({
            offset,
            ...variables,
        })
        if (!trackQuery.has(key)) {
            setTrackQuery(trackQuery => new Map(trackQuery).set(key, true))
            fetchMoreArgs?.onStart?.()
            queryResult.fetchMore({
                variables: {
                    offset,
                    limit,
                    ...variables,
                },
                updateQuery: (existing, { fetchMoreResult }: { fetchMoreResult: T }) => updateQuery(existing, fetchMoreResult)
            })
                .then(() => {
                    setOffset(offset => offset + limit)
                    fetchMoreArgs?.onSuccess?.()
                })
                .catch(() => {
                    fetchMoreArgs?.onError?.()
                })
                .finally(() => {
                    fetchMoreArgs?.onFinally?.()
                })
        }
    }

    return [offset, fetchMore] as const
}