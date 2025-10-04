"use client";

import { useQuery } from "@apollo/client/react";
import { GET_POST_COMMENTS } from "@/graphql/queries/comment/GetPostComments";

interface UsePostCommentsOptions {
  postId: string;
  pageSize?: number;
  directRepliesLimit?: number;
  secondLevelLimit?: number;
}

interface PostCommentUser {
  id: string;
  firstname: string;
  lastname?: string;
  avatarUrl?: string;
}

interface PostCommentNode {
  id: string;
  content: string;
  createdAt: string;
  replyCount?: number;
  repliesHasNextPage?: boolean;
  createdBy: PostCommentUser;
  replies?: PostCommentNode[];
}

interface PostCommentsConnection {
  edges: { node: PostCommentNode; cursor: string }[];
  pageInfo: { endCursor?: string; hasNextPage: boolean };
  totalCount: number;
}

interface PostCommentsData {
  postComments: PostCommentsConnection;
}

interface PostCommentsVars {
  postId: string;
  first: number;
  after?: string;
  directRepliesLimit: number;
  secondLevelLimit: number;
}

export const usePostComments = ({
  postId,
  pageSize = 8,
  directRepliesLimit = 3,
  secondLevelLimit = 2,
}: UsePostCommentsOptions) => {
  const { data, loading, error, fetchMore, refetch } = useQuery<PostCommentsData, PostCommentsVars>(GET_POST_COMMENTS, {
    variables: {
      postId,
      first: pageSize,
      directRepliesLimit,
      secondLevelLimit,
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    skip: !postId,
  });

  const connection = data?.postComments;
  const comments = connection?.edges?.map((e: any) => e.node) || [];
  const pageInfo = connection?.pageInfo;
  const totalCount = connection?.totalCount ?? 0;

  const loadMore = () => {
    if (!pageInfo?.hasNextPage) return Promise.resolve();
    return fetchMore({
      variables: { after: pageInfo.endCursor },
      updateQuery: (prev: PostCommentsData, { fetchMoreResult }: { fetchMoreResult?: PostCommentsData }) => {
        if (!fetchMoreResult) return prev;
        return {
          postComments: {
            ...fetchMoreResult.postComments,
            edges: [...prev.postComments.edges, ...fetchMoreResult.postComments.edges],
          },
        };
      },
    });
  };

  return {
    comments,
    loading,
    error,
    loadMore,
    hasNextPage: pageInfo?.hasNextPage ?? false,
    totalCount,
    refetch,
  };
};
