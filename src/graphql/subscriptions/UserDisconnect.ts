import { gql } from "@apollo/client";

export const USER_DISCONNECT_SUBSCRIPTION = gql`
  subscription UserDisconnect($userId: String!) {
    userDisconnect(userId: $userId) {
      userId
      isOnline
      lastSeenAt
    }
  }
`;
