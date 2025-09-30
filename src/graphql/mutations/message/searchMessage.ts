import { gql } from "@apollo/client";

export const SEARCH_MESSAGES = gql`
  mutation SearchMessages($input: String!) {
    searchMessages(input: $input) {
      id
      content
      sender {
        id
        firstname
        lastname
        avatarUrl
      }
      timestamp
    }
  }
`;