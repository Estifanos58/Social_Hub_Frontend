import { gql } from "@apollo/client";

export const GET_MESSAGES = gql`
  query MessagesBetweenUsers($otherUserId: String!, $limit: Int, $offset: Int) {
    messagesBetweenUsers(otherUserId: $otherUserId, limit: $limit, offset: $offset) {
      id
      content
      imageUrl
      createdAt
      updatedAt
      isEdited
      user {
        id
        firstname
        lastname
        avatarUrl
        lastSeenAt
      }
      chatroom {
        id
        name
        isGroup
        avatarUrl
        memberships {
          userId
          user {
            id
            firstname
            lastname
            avatarUrl
            lastSeenAt
          }
        }
      }
    }
  }
`;