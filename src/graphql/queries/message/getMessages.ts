import { gql } from "@apollo/client";

export const GET_MESSAGES = gql`
  query GetMessages($take: Int, $skip: Int) {
    getMessages(take: $take, skip: $skip) {
      id
      content
      sender {
        id
        firstname
        lastname
        avatarUrl
      }
      createdAt
    }
  }
`;