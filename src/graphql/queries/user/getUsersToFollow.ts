import { gql } from "@apollo/client";

export const GET_USERS_TO_FOLLOW = gql`
    query GetUsersToFollow($limit: Int!, $offset: Int!) {
        GetUsersToFollow(getUsersToFollow: { limit: $limit, offset: $offset }) {
            users {
                id
                firstname
                avatarUrl
                email
                bio
                isPrivate
                isFollowing
            }
            hasMore
        }
    }
`;