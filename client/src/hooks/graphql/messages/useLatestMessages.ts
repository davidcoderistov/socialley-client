import { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { GET_LATEST_MESSAGES } from '../../../graphql/queries/messages'
import { GetLatestMessagesQueryType } from '../../../graphql/types/queries/messages'
import { FullMessage } from '../../../graphql/types/models'
import _differenceBy from 'lodash/differenceBy'


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

    const offset: number = useMemo(() => latestMessages.filter(message => !message.temporary).length, [latestMessages])

    const hasMoreLatestMessages: boolean = useMemo(() => offset < latestMessagesCount, [offset, latestMessagesCount])

    const handleFetchMore = () => {
        fetchMore({
            variables: {
                offset,
            },
            updateQuery (existing: GetLatestMessagesQueryType, { fetchMoreResult }: { fetchMoreResult: GetLatestMessagesQueryType }) {
                return {
                    ...existing,
                    getLatestMessages: {
                        ...existing.getLatestMessages,
                        data: [
                            ..._differenceBy(
                                existing.getLatestMessages.data,
                                fetchMoreResult.getLatestMessages.data,
                                '_id'
                            ),
                            ...fetchMoreResult.getLatestMessages.data.map(message => ({ ...message, temporary: false }))
                        ]
                    }
                }
            }
        }).catch(console.log)
    }

    return [
        { latestMessages, latestMessagesCount, hasMoreLatestMessages, latestMessagesLoading: loading },
        handleFetchMore
    ] as const
}