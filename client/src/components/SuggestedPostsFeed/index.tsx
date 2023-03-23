import React, { useState, useMemo } from 'react'
import { useFetchMore } from '../../hooks/misc'
import { useQuery } from '@apollo/client'
import { GET_SUGGESTED_POSTS } from '../../graphql/queries/posts'
import { GetSuggestedPostsQueryType } from '../../graphql/types/queries/posts'
import { BoxProps } from '@mui/material/Box'
import PostsFeed from '../PostsFeed'
import PostDetailsView from '../PostDetailsView'


export default function SuggestedPostsFeed ({ boxProps = {} }: { boxProps?: BoxProps }) {

    const [viewingPostId, setViewingPostId] = useState<string | null>(null)

    const suggestedPosts = useQuery<GetSuggestedPostsQueryType>(GET_SUGGESTED_POSTS, {
        variables: {
            offset: 0,
            limit: 6,
        }
    })

    const [offset, fetchMoreSuggestedPosts] = useFetchMore<GetSuggestedPostsQueryType>({
        queryResult: suggestedPosts,
        updateQuery (existing, incoming) {
            return {
                ...existing,
                getSuggestedPosts: {
                    ...existing.getSuggestedPosts,
                    data: [
                        ...existing.getSuggestedPosts.data,
                        ...incoming.getSuggestedPosts.data,
                    ]
                }
            }
        }
    }, 6)

    const posts = useMemo(() => {
        if (suggestedPosts.data) {
            return suggestedPosts.data.getSuggestedPosts.data
        }
        return []
    }, [suggestedPosts.data])

    const hasMorePosts = useMemo(() => {
        if (suggestedPosts.loading || suggestedPosts.error || !suggestedPosts.data) {
            return false
        }
        return offset < suggestedPosts.data.getSuggestedPosts.total
    }, [offset, suggestedPosts.loading, suggestedPosts.error])

    const handleFetchMorePosts = () => {
        fetchMoreSuggestedPosts()
    }

    const handleClickPost = (postId: string) => {
        setViewingPostId(postId)
    }

    const handleCloseViewPost = () => {
        setViewingPostId(null)
    }

    return (
        <>
            <PostsFeed
                boxProps={boxProps}
                posts={posts}
                isPostsLoading={suggestedPosts.loading}
                hasMorePosts={hasMorePosts}
                onFetchMorePosts={handleFetchMorePosts}
                onClickPost={handleClickPost} />
            <PostDetailsView
                postId={viewingPostId}
                onClose={handleCloseViewPost} />
        </>
    )
}