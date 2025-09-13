import { gql } from "@apollo/client";

export const CREATE_POST = gql`
    mutation CreatePost($content: String!, $imageUrls: [String!]!) {
        createPost(createPost : { content: $content, imageUrls: $imageUrls}) 
    }
`;
