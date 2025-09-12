import { gql } from "@apollo/client";

export const GET_CURRENT_USER = gql`
  query GetMe {
    getme {
        id
        email
        firstname
        lastname
        avatarUrl
        lastSeenAt
        createdAt
        updatedAt
        verified
        isPrivate
        bio
    }
  }
`;
