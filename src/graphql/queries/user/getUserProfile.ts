import { gql } from "@apollo/client";

export const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: String!) {
    GetUser(userId: $userId) {
      user {
        avatarUrl
        firstname
        lastname
        bio
        email
        isPrivate
      }
      followers
      following
      posts {
        id
        imageUrl
        likes
        comments
      }
    }
  }
`;
