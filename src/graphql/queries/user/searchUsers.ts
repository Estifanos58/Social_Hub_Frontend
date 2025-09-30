import { gql } from "@apollo/client";

export const SEARCH_USERS = gql`
  query SearchUsers($searchUsersInput: SearchUsersInput!) {
    SearchUsers(searchUsersInput: $searchUsersInput) {
      hasMore
      users {
        id
        firstname
        lastname
        email
        avatarUrl
      }
    }
  }
`;
