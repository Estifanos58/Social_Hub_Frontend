import { gql } from "@apollo/client";

export const GET_FOLLOWERS = gql`
    query GetFollowers(getFollowers: { limit: Int!, offset: Int! }) {
        GetFollowers(getFollowers: { limit: $limit, offset: $offset }) {
            users {
                id
                firstname
                avatarUrl
                email
            }
            totalFollowers
            totalFollowing
    }
}
`