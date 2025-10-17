import { gql } from "@apollo/client";

export const GET_FOLLOWING = gql`
    query GetFollowing( $take: Int!, $skip: Int! ) {
        GetFollowing(getFollowing: { take: $take, skip: $skip }) {
            users {
                id
                firstname
                avatarUrl
                bio
            }
            totalFollowers
            totalFollowing
            hasMore
    }
}
`