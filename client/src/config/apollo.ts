import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createUploadLink } from 'apollo-upload-client'
import { createClient } from 'graphql-ws'
import { getStorageLoggedInUser } from '../localStorage'
import {FollowedUserPost} from "../types";


const httpLink = createHttpLink({
    uri: 'http://localhost:5000/api',
    credentials: 'include',
})

const uploadLink = createUploadLink({
    uri: 'http://localhost:5000/api',
    headers: {
        'Apollo-Require-Preflight': 'true',
    },
}) as unknown as ApolloLink

const authLink = new ApolloLink((operation, forward) => {
    const user = getStorageLoggedInUser()

    operation.setContext({
        headers: {
            authorization: user?.accessToken ? `Bearer ${user.accessToken}` : "",
        }
    })

    return forward(operation)
})

const wsLink = new GraphQLWsLink(createClient({
    url: 'ws://localhost:5000/api',
    connectionParams: () => ({
        accessToken: getStorageLoggedInUser()?.accessToken,
    })
}))

const splitLink = split(
    operation => operation.getContext().hasUpload,
    authLink.concat(uploadLink),
    split(
        ({ query }) => {
            const definition = getMainDefinition(query)
            return (
                definition.kind === 'OperationDefinition' &&
                definition.operation === 'subscription'
            )
        },
        wsLink,
        authLink.concat(httpLink),
    )
)

const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                getLatestMessages: {
                    keyArgs: false
                },
                getLatestChatMessages: {
                    keyArgs: ['userId']
                }
            }
        },
        FullMessage: {
            fields: {
                temporary: {
                    read (temporary = false) {
                        return temporary
                    }
                }
            },
        },
        Message: {
            fields: {
                temporary: {
                    read (temporary = false) {
                        return temporary
                    }
                }
            },
        },
        LikingUser: {
            fields: {
                isFollowingLoading: {
                    read (isFollowingLoading = false) {
                        return isFollowingLoading
                    }
                }
            }
        },
        FollowedUserPost: {
            fields: {
                isLikedLoading: {
                    read (isLikedLoading = false) {
                        return isLikedLoading
                    }
                },
                isFavoriteLoading: {
                    read (isFavoriteLoading = false) {
                        return isFavoriteLoading
                    }
                }
            }
        }
    }
})

const client = new ApolloClient({
    link: splitLink,
    cache,
})

export default client