import { gql } from "@apollo/client";

// parentId is optional (null for top-level comment)
export const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($postId: String!, $content: String!, $parentId: String) {
    createComment(createCommentInput: { postId: $postId, content: $content, parentId: $parentId }) {
      id
      content
      postId
      createdAt
      parentId
      replyCount
      createdBy {
        id
        avatarUrl
        firstname
        lastname
      }
      updatedAt
    }
  }
`;