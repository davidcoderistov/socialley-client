import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createUploadLink } from 'apollo-upload-client'
import { createClient } from 'graphql-ws'
import { getStorageLoggedInUser } from '../localStorage'
import { FollowableUser, PostDetails } from '../graphql/types/models'


const apiUri = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api' : 'https://socialley-api/api'
const wsUrl = process.env.NODE_ENV === 'development' ? 'ws://localhost:5000/api' : 'ws://socialley-api/api'

const httpLink = createHttpLink({
    uri: apiUri,
    credentials: 'include',
})

const uploadLink = createUploadLink({
    uri: apiUri,
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
    url: wsUrl,
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
                getFollowingForUser: {
                    keyArgs: ['userId'],
                },
                getFollowersForUser: {
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
                },
                getPostLikeNotificationsForUser: {
                    keyArgs: false,
                },
                getPostCommentNotificationsForUser: {
                    keyArgs: false,
                },
                getFollowNotificationsForUser: {
                    keyArgs: false,
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
                },
                isFollowingLoading: {
                    read (isFollowingLoading = false) {
                        return isFollowingLoading
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