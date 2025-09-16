import { gql } from "@apollo/client";

export const GET_FOLLOWING = gql`
    query GetFollowing(getFollowing: { limit: Int!, offset: Int! }) {
        GetFollowing(getFollowing: { limit: $limit, offset: $offset }) {
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