import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation Register(
    $firstname: String!
    $lastname: String!
    $email: String!
    $password: String!
  ) {
    register(
      registerInput: {
        email: $email
        firstname: $firstname
        lastname: $lastname
        password: $password
      }
    ) {
        accessToken
        refreshToken
      user {
        id
        firstname
        email
      }
    }
  }
`;
