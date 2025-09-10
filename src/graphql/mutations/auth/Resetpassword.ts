import { gql } from "@apollo/client";

export const RESET_PASSWORD = gql`
      mutation ResetPassword(
        $token: String!, 
        $newPassword: String!
        ) {
    resetPassword(
        token: $token, 
        newPassword: $newPassword
        ) {
        user {
            id
            firstname
            email
            bio
            avatarUrl
        }
    }
  }
`;