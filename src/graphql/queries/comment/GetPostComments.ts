import { gql } from "@apollo/client";

export const GET_POST_COMMENTS = gql`
query GetPostComments($postId: ID!, $first: Int = 5, $after: String, $directRepliesLimit: Int = 3, $secondLevelLimit: Int = 2) {
  postComments(postId: $postId, first: $first, directRepliesLimit: $directRepliesLimit, secondLevelLimit: $secondLevelLimit, after: $after) {
    edges {
      node {
        id
        content
        createdAt
        replyCount
        repliesHasNextPage
        createdBy {
          id
          firstname
          lastname
          avatarUrl
        }
        replies {
          id
          content
          replyCount
          repliesHasNextPage
          createdBy { id firstname avatarUrl }
          replies {
            id
            content
            createdBy { id firstname avatarUrl }
          }
        }
      }
      cursor
    }
    pageInfo { endCursor hasNextPage }
    totalCount
  }
}
`;