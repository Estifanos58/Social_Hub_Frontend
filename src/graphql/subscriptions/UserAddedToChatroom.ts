import { gql } from "@apollo/client";

export const USER_ADDED_TO_CHATROOM_SUBSCRIPTION = gql`
  subscription UserAddedToChatroom($otherUserId: String!) {
    userAddedToChatroom(otherUserId: $otherUserId) {
      id
      name
      isGroup
      avatarUrl
      createdAt
      updatedAt
      memberships {
        userId
        user {
          id
          firstname
          lastname
          avatarUrl
        }
      }
      messages {
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
        }
      }
    }
  }
`;
