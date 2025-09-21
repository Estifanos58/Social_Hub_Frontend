import { gql } from "@apollo/client";

export const GET_POSTS = gql`
    query GetPosts ($take: Float!, $cursor: String!) {
        getPosts (take: $take, cursor: $cursor) {
            posts {
                id
                content
                createdAt
                updatedAt
                createdBy {
                    id
                    firstname
                    lastname
                    avatarUrl
                    lastSeenAt
                }
                commentsCount
                reactionsCount
                images {
                    id
                    url
                    postId
                }
            }
            hasMore
        }    
}
`;
