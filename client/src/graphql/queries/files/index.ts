import { gql } from '@apollo/client'


export const GET_IMAGE = gql`
    query getImage($url: String!) {
        getImage(url: $url)
    }
`