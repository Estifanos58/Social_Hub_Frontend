import { gql } from "@apollo/client";

export const DELETE_POST = gql`
    mutation DeletePost($postId: String!) {
        deletePost(postId: $postId)}`