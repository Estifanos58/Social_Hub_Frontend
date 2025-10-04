import { gql } from "@apollo/client";

export const GET_POST = gql`
  query GetPost($postId: String!) {
    getPost(postId: $postId) {
      id
      content
      createdAt
      updatedAt
      createdById
      createdBy {
        id
        firstname
        lastname
        avatarUrl
      }
      images {
        id
        url
        postId
      }
      comments {
        id
        content
        createdAt
        createdBy {
          id
          firstname
          lastname
          avatarUrl
        }
        parentId
        updatedAt
      }
      reactions {
        id
        type
        createdById
      }
      commentsCount
      reactionsCount
      userReaction
    }
  }
`;
