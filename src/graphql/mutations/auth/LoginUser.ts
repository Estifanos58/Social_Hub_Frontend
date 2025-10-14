import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      accessToken
      refreshToken
      user {
        id
        email
        firstname
        avatarUrl
      }
    }
  }
`;
