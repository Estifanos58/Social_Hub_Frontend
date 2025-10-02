import { gql } from "@apollo/client";

export const NEW_MESSAGE_SUBSCRIPTION = gql`
  subscription NewMessage($chatroomId: String!, $userId: String!) {
    newMessage(chatroomId: $chatroomId, userId: $userId) {
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
          }
        }
      }
    }
  }
`;