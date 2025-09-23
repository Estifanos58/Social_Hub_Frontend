import { gql } from "@apollo/client";

export  const REMOVE_REACTION_MUTATION = gql`
    mutation RemoveReaction($postId: String!) {
      removeReaction(postId: $postId)
    }
  `;