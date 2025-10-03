import { gql } from "@apollo/client";

export const CHATROOM_CREATED_SUBSCRIPTION = gql`
  subscription ChatroomCreated($otherUserId: String!) {
    chatroomCreated(otherUserId: $otherUserId) {
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
      }
    }
  }
`;
