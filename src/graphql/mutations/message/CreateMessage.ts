import { gql } from "@apollo/client";

export const CREATE_MESSAGE = gql`
  mutation CreateMessage(
    $chatroomId: String
    $otherUserId: String
    $content: String
    $imageUrl: String
  ) {
    createMessageMutation(
      chatroomId: $chatroomId
      otherUserId: $otherUserId
      content: $content
      imageUrl: $imageUrl
    ) {
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