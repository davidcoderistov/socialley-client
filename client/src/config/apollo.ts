import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createUploadLink } from 'apollo-upload-client'
import { createClient } from 'graphql-ws'
import { getStorageLoggedInUser } from '../localStorage'
import { FollowableUser, PostDetails } from '../graphql/types/models'


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
                getFollowedUsersPosts: {
                    keyArgs: false,
                },
                getLatestMessages: {
                    keyArgs: false
                },
                getLatestChatMessages: {
                    keyArgs: ['userId']
                },
                getUsersWhoLikedPost: {
                    keyArgs: ['postId']
                },
                getCommentsForPost: {
                    keyArgs: ['postId']
                },
                getUsersWhoLikedComment: {
                    keyArgs: ['commentId']
                },
                getPostsForUser: {
                    keyArgs: ['userId'],
                },
                getLikedPostsForUser: {
                    keyArgs: false,
                },
                getFavoritePostsForUser: {
                    keyArgs: false,
                },
                getSuggestedUsers: {
                    keyArgs: false,
                },
                getSearchedUsersForUser: {
                    merge (_, incoming) {
                        return incoming
                    }
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
        FollowableUser: {
            keyFields: (followableUserStoreObject) => {
                const followableUser = followableUserStoreObject as unknown as FollowableUser & { __typename: string }
                return `${followableUser.__typename}:${followableUser.user._id}`
            }
        },
        SuggestedUser: {
            fields: {
                isFollowingLoading: {
                    read (isFollowingLoading = false) {
                        return isFollowingLoading
                    }
                }
            }
        },
        UserWhoLikedPost: {
            fields: {
                isFollowingLoading: {
                    read (isFollowingLoading = false) {
                        return isFollowingLoading
                    }
                }
            }
        },
        UserWhoLikedComment: {
            fields: {
                isFollowingLoading: {
                    read (isFollowingLoading = false) {
                        return isFollowingLoading
                    }
                }
            }
        },
        PostDetails: {
            keyFields: (postDetailsStoreObject) => {
                const postDetails = postDetailsStoreObject as unknown as PostDetails & { __typename: string }
                return `${postDetails.__typename}:${postDetails.post._id}`
            },
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
        },
        Comment: {
            fields: {
                isLikedLoading: {
                    read (isLikedLoading = false) {
                        return isLikedLoading
                    }
                }
            }
        },
        FollowingUser: {
            fields: {
                isFollowingLoading: {
                    read (isFollowingLoading = false) {
                        return isFollowingLoading
                    }
                }
            }
        },
        FollowerUser: {
            fields: {
                isFollowingLoading: {
                    read (isFollowingLoading = false) {
                        return isFollowingLoading
                    }
                }
            }
        },
        SearchedUser: {
            fields: {
                isFollowingLoading: {
                    read (isFollowingLoading = false) {
                        return isFollowingLoading
                    }
                }
            }
        },
        UserDetails: {
            fields: {
                isFollowingLoading: {
                    read (isFollowingLoading = false) {
                        return isFollowingLoading
                    }
                }
            }
        },
        FollowNotification: {
            fields: {
                isFollowingLoading: {
                    read (isFollowingLoading = false) {
                        return isFollowingLoading
                    }
                }
            }
        },
    }
})

const client = new ApolloClient({
    link: splitLink,
    cache,
})

export default client