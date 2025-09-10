import { gql } from "@apollo/client";

export const GET_CURRENT_USER = gql`
  query GetMe {
    getme {
      user {
        id
        email
        firstname
        lastname
        avatarUrl
        isEmailVerified
        bio
      }
    }
  }
`;
