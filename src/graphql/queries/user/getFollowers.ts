import { gql } from "@apollo/client";

export const GET_FOLLOWERS = gql`
    query GetFollowers($take: Int!, $skip: Int! ) {
        GetFollowers(getFollowers: { take: $take, skip: $skip }) {
            users {
                id
                firstname
                avatarUrl
                email
            }
            totalFollowers
            totalFollowing
            hasMore
    }
}
`