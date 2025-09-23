import { gql } from "@apollo/client";

export const ADD_REACTION_MUTATION = gql`
    mutation AddReaction($postId: String!, $type: String!) {
      addReaction(postId: $postId, type: $type)
    }
  `;