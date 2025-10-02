import { gql } from "@apollo/client";

export const NEW_MESSAGE_SUBSCRIPTION = gql`
  subscription NewMessage($chatroomId: String, $otherUserId: String) {
    newMessage(chatroomId: $chatroomId, otherUserId: $otherUserId) {
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