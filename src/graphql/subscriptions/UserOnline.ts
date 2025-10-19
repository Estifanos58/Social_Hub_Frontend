import { gql } from "@apollo/client";

export const USER_ONLINE_SUBSCRIPTION = gql`
  subscription UserOnline($userId: String!) {
    userOnline(userId: $userId) {
      userId
      isOnline
      lastSeenAt
    }
  }
`;
