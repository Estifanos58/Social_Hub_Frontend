import { gql } from "@apollo/client";

export const GET_NOTIFICATIONS = gql`
  query GetNotifications($take: Int, $cursor: String) {
    notifications(take: $take, cursor: $cursor) {
      id
      type
      isRead
      createdAt
      actor {
        id
        firstname
        lastname
        avatarUrl
      }
      recipient {
        id
        firstname
        lastname
        avatarUrl
      }
      post {
        id
        content
        images { id url }
      }
      comment { id content }
      reaction { id type }
    }
  }
`;
