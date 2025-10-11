import { gql } from "@apollo/client";

export const CREATE_CHATROOM = gql`
  mutation CreateChatroom(
    $chatroomName: String
    $isGroupChat: Boolean
    $otherUserId: String
    $avatarUrl: String
  ) {
    createChatroomMutation(
      chatroomName: $chatroomName
      isGroupChat: $isGroupChat
      otherUserId: $otherUserId
      avatarUrl: $avatarUrl
    )
  }
`;
