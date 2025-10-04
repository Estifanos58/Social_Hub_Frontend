import { gql } from "@apollo/client";

export const UNFOLLOW_USER = gql`
    mutation UnfollowUser($followingId: String!) {
        UnfollowUser(followingId: $followingId)
    }
`;
