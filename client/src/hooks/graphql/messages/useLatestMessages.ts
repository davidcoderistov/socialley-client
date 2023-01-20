import { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { GET_LATEST_MESSAGES } from '../../../graphql/queries/messages'
import { FullMessage } from '../../../types'
import { LatestMessagesQueryData } from '../../../graphql/types'


export function useLatestMessages ({ limit }: { limit: number }) {

    const { data, fetchMore, loading } = useQuery(GET_LATEST_MESSAGES, {
        variables: {
            offset: 0,
            limit,
        },
    })

    const latestMessages: FullMessage[] = useMemo(() => {
        const latestMessages = data?.getLatestMessages?.data
        if (Array.isArray(latestMessages)) {
            return latestMessages
        }
        return []
    }, [data])

    const latestMessagesCount: number = useMemo(() => data?.getLatestMessages?.total ?? 0, [data])

    const handleFetchMore = () => {
        fetchMore({
            variables: {
                offset: latestMessages.length,
            },
            updateQuery (existing: LatestMessagesQueryData, { fetchMoreResult }: { fetchMoreResult: LatestMessagesQueryData }) {
                return {
                    ...existing,
                    getLatestMessages: {
                        ...existing.getLatestMessages,
                        data: [...existing.getLatestMessages.data, ...fetchMoreResult.getLatestMessages.data]
                    }
                }
            }
        }).catch(console.log)
    }

    return [
        { latestMessages, latestMessagesCount, latestMessagesLoading: loading },
        handleFetchMore
    ] as const
}