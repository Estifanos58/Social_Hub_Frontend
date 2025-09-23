import { gql } from "@apollo/client";

export const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($postId: String!, $content: String! $parentId: String!) {
    createComment(createCommentInput : {postId: $postId, content: $content, parentId: $parentId}) {
        comment {
            id
            content
            postId
            createdAt
            parentId
            createdBy {
                id
                avatarUrl
                firstname
            }
            updatedAt
        }
    }
}`