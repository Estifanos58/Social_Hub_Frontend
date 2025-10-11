import { gql } from "@apollo/client";

export const GET_CHATROOM_DETAIL = gql`
  query ChatroomDetail($chatroomId: String!) {
    chatroomDetail(chatroomId: $chatroomId) {
      id
      isGroup
      name
      avatarUrl
      totalMessages
      totalPhotos
      totalMembers
      members {
        id
        userId
        firstname
        lastname
        avatarUrl
        isOwner
      }
      directUser {
        id
        firstname
        lastname
        avatarUrl
        bio
        email
        totalFollowers
        totalFollowing
      }
    }
  }
`;
