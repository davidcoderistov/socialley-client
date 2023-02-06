import { ApolloError } from '@apollo/client'
import moment from 'moment'


export const GRAPHQL_ERROR_CODES = {
    MONGODB_VALIDATION_FAILED: 'MONGODB_VALIDATION_FAILED',
    MONGODB_SERVER_ERROR: 'MONGODB_SERVER_ERROR',
    INVALID_SESSION: 'INVALID_SESSION',
}

interface ValidationError {
    [path: string]: string
}

export const getValidationError = (err: ApolloError): ValidationError | null => {
    if (err.graphQLErrors.length > 0) {
        const error = err.graphQLErrors[0]
        if (error.extensions.code === GRAPHQL_ERROR_CODES.MONGODB_VALIDATION_FAILED) {
            return error.extensions.errors as ValidationError
        }
    }
    return null
}

export const isInvalidSessionError = (err: any): boolean => {
    if (err instanceof ApolloError) {
        if (err.graphQLErrors.length > 0) {
            return err.graphQLErrors[0].extensions.code === GRAPHQL_ERROR_CODES.INVALID_SESSION
        }
    }
    return false
}

export const getInitial = (name: string): string | null => {
    if (name.length > 0) {
        return name.charAt(0).toUpperCase()
    }
    return null
}

export const getTimeElapsed = (timestamp: number) => {
    const now = moment()
    const ago = moment(timestamp)

    if (now.diff(ago, 'seconds') < 1) {
        return 'Now'
    } else if (now.diff(ago, 'minutes') < 1) {
        return `${now.diff(ago, 'seconds')}s`
    } else if (now.diff(ago, 'minutes') < 60) {
        return `${now.diff(ago, 'minutes')}m`
    } else if (now.diff(ago, 'hours') < 24) {
        return `${now.diff(ago, 'hours')}h`
    } else if (now.diff(ago, 'days') < 7) {
        return `${now.diff(ago, 'days')}d`
    } else {
        return `${now.diff(ago, 'weeks')}w`
    }
}