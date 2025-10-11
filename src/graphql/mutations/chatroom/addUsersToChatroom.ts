import { gql } from "@apollo/client";

export const ADD_USERS_TO_CHATROOM = gql`
  mutation AddUsersToChatroom(
    $userId: String!
    $chatroomId: String!
    $otherUserIds: [String!]!
  ) {
    addUserToChatroomMutation(
      userId: $userId
      chatroomId: $chatroomId
      otherUserIds: $otherUserIds
    )
  }
`;
