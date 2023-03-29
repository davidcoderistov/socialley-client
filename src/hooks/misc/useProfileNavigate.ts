import { useNavigate } from 'react-router-dom'
import { useLoggedInUser } from './useLoggedInUser'

export function useProfileNavigate () {

    const navigate = useNavigate()

    const [loggedInUser] = useLoggedInUser()

    return (userId: string) => {
        if (userId === loggedInUser._id) {
            return navigate('/profile')
        } else {
            return navigate(`/users/${userId}`)
        }
    }
}