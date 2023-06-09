import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import SignUp, { SignUpProps } from '../../components/SignUp'
import { useMutation, ApolloError } from '@apollo/client'
import { SIGN_UP } from '../../graphql/mutations/auth'
import { SignUpMutationType } from '../../graphql/types/mutations/auth'
import { getValidationError } from '../../utils'


export default function SignUpPage () {

    const navigate = useNavigate()

    const [signUp, { loading }] = useMutation<SignUpMutationType>(SIGN_UP)

    const { enqueueSnackbar } = useSnackbar()

    const handleSignUp = (signUpProps: SignUpProps) => {
        signUp({
            variables: {
                user: {
                    firstName: signUpProps.data.firstName,
                    lastName: signUpProps.data.lastName,
                    username: signUpProps.data.username,
                    email: signUpProps.data.email,
                    password: signUpProps.data.password,
                }
            }
        }).then(() => {
            enqueueSnackbar('You have signed up successfully', { variant: 'success' })
            navigate('/login')
        }).catch((err: ApolloError) => {
            const validationError = getValidationError(err)
            if (validationError?.firstName) {
                return signUpProps.setServerError('firstName', validationError.firstName)
            } else if (validationError?.lastName) {
                return signUpProps.setServerError('lastName', validationError.lastName)
            } else if (validationError?.username) {
                return signUpProps.setServerError('username', validationError.username)
            } else if (validationError?.email) {
                return signUpProps.setServerError('email', validationError.email)
            } else if (validationError?.password) {
                return signUpProps.setServerError('password', validationError.password)
            }
            enqueueSnackbar('Could not sign up. Please try again later', { variant: 'error' })
        })
    }

    const handleSignIn = () => {
        navigate('/login')
    }

    return (
        <SignUp
            onSignUp={handleSignUp}
            onSignIn={handleSignIn}
            signingUp={loading} />
    )
}