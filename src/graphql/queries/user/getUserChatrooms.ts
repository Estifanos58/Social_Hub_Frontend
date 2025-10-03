import { gql } from "@apollo/client";

export const GET_USER_CHATROOMS = gql`
  query GetUserChatrooms {
    GetUserChatrooms {
      chatrooms {
        id
        name
        isGroup
        avatarUrl
        createdById
        createdAt
        updatedAt
        memberships {
          userId
          lastReadAt
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
  }
`;
