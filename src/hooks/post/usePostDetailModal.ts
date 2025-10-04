import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_POST } from "@/graphql/queries/post/GetPost";
import { SelectedPost } from "@/store/generalStore";
import { usePostComments } from "@/hooks/post/usePostComments";
import { formatRelative } from "@/lib/utils";
import { CommentNode } from "../../components/custom/CommentItem";
import { toast } from "sonner";

interface DetailedSelectedPost extends SelectedPost {
  reactionsCount?: number | null;
  commentsCount?: number | null;
  userReaction?: string | null;
  images?: { id: string; url: string }[];
  imageUrl?: string | null;
  likes?: number | null;
}

interface GetPostData {
  getPost: DetailedSelectedPost | null;
}

interface GetPostVars {
  postId: string;
}

const getTimestamp = (value?: string | null) => {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : 0;
};

const sortCommentTree = (comments: CommentNode[]): CommentNode[] => {
  const sorted = comments
    .map((comment) => {
      const nested = Array.isArray(comment.replies) ? sortCommentTree(comment.replies) : undefined;
      return {
        ...comment,
        replies: nested && nested.length > 0 ? nested : undefined,
      } as CommentNode;
    })
    .sort((a, b) => getTimestamp(a.createdAt) - getTimestamp(b.createdAt));

  return sorted;
};

const buildCommentTreeFromFlat = (comments: any[]): CommentNode[] => {
  const map = new Map<string, CommentNode>();

  comments.forEach((raw) => {
    if (!raw || !raw.id) return;
    map.set(raw.id, {
      ...raw,
      parentId: raw.parentId ?? null,
      replies: undefined,
    });
  });

  const roots: CommentNode[] = [];

  map.forEach((comment) => {
    if (comment.parentId && map.has(comment.parentId)) {
      const parent = map.get(comment.parentId)!;
      const existingReplies = Array.isArray(parent.replies) ? parent.replies : [];
      parent.replies = [...existingReplies, comment];
    } else {
      roots.push(comment);
    }
  });

  return sortCommentTree(roots);
};

const normalizeComments = (comments: any): CommentNode[] => {
  if (!Array.isArray(comments) || comments.length === 0) {
    return [];
  }

  const hasNestedReplies = comments.some((comment) => Array.isArray(comment?.replies) && comment.replies.length > 0);

  if (hasNestedReplies) {
    const cloned = comments.map((comment) => ({
      ...comment,
      replies: normalizeComments(comment?.replies),
    }));
    return sortCommentTree(cloned as CommentNode[]);
  }

  const hasParentRelations = comments.some((comment) => comment?.parentId);

  if (hasParentRelations) {
    return buildCommentTreeFromFlat(comments);
  }

  const cloned = comments.map((comment) => ({
    ...comment,
    replies: normalizeComments(comment?.replies),
  }));

  return sortCommentTree(cloned as CommentNode[]);
};

const buildImages = (post: DetailedSelectedPost | null) => {
  if (Array.isArray(post?.images) && post.images.length) {
    return post.images;
  }

  const fallbackImageUrl = (post as any)?.imageUrl;
  return fallbackImageUrl
    ? [
        {
          id: post?.id ?? "fallback-image",
          url: fallbackImageUrl,
        },
      ]
    : [];
};

const buildReactionSummary = (
  detailData: GetPostData | undefined,
  resolvedPost: DetailedSelectedPost | null,
  fallbackPost: SelectedPost | null,
) => {
  const detail = detailData?.getPost as any;
  const resolved = resolvedPost as any;
  const fallback = fallbackPost as any;

  const knownCount = [
    detail?.commentsCount,
    resolved?.commentsCount,
    fallback?.commentsCount,
  ].find((value) => typeof value === "number") as number | undefined;

  const commentsCount = (() => {
    if (typeof knownCount === "number") return knownCount;
    if (typeof fallback?.comments === "number") return fallback.comments;

    const commentsArray = [resolved?.comments, fallback?.comments].find(Array.isArray) as
      | { length: number }
      | undefined;

    return commentsArray?.length ?? 0;
  })();

  return {
    id: resolvedPost?.id ?? fallbackPost?.id ?? "",
    reactionsCount:
      detail?.reactionsCount ??
      resolved?.reactionsCount ??
      fallback?.reactionsCount ??
      fallback?.likes ??
      0,
    userReaction:
      detail?.userReaction ??
      resolved?.userReaction ??
      fallback?.userReaction ??
      null,
    commentsCount,
  };
};

const buildCreatedAtLabel = (post: DetailedSelectedPost | null) => {
  return post?.createdAt ? formatRelative(post.createdAt) : "moments ago";
};

export const sliderSettings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
};

export const usePostDetailModal = (post: SelectedPost | null) => {
  const hasCompletePost = Boolean(
    post && Array.isArray(post.images) && post.createdBy && post.content,
  );

  const shouldFetchPost = Boolean(post?.id) && !hasCompletePost;

  const {
    data: postDetailsData,
    loading: postDetailsLoading,
  } = useQuery<GetPostData, GetPostVars>(GET_POST, {
    variables: { postId: post?.id ?? "" },
    skip: !shouldFetchPost,
    fetchPolicy: "cache-first",
  });

  const resolvedPost = useMemo<DetailedSelectedPost | null>(() => {
    if (postDetailsData?.getPost) {
      return postDetailsData.getPost;
    }
    return post ?? null;
  }, [postDetailsData?.getPost, post]);

  const images = useMemo(() => buildImages(resolvedPost), [resolvedPost]);

  const reactionSummary = useMemo(
    () => buildReactionSummary(postDetailsData, resolvedPost, post ?? null),
    [postDetailsData, resolvedPost, post],
  );

  const createdAtLabel = useMemo(
    () => buildCreatedAtLabel(resolvedPost),
    [resolvedPost?.createdAt],
  );

  const postId = resolvedPost?.id ?? post?.id;

  const {
    comments: liveComments,
    loading: commentsLoading,
    loadMore,
    hasNextPage,
  } = usePostComments({ postId: postId ?? "" });

  const initialCommentsData = resolvedPost?.comments;
  const normalizedInitialComments = useMemo(
    () => normalizeComments(initialCommentsData),
    [initialCommentsData],
  );

  const mergedComments = useMemo(() => {
    if (liveComments.length > 0) {
      return normalizeComments(liveComments);
    }
    return normalizedInitialComments;
  }, [liveComments, normalizedInitialComments]);

  const [localReplies, setLocalReplies] = useState<Record<string, CommentNode[]>>({});

  const handleReplyAdded = (parentId: string, reply: CommentNode) => {
    setLocalReplies((prev) => ({
      ...prev,
      [parentId]: prev[parentId] ? [...prev[parentId], reply] : [reply],
    }));
    toast.success("Reply added");
  };

  const commentsWithLocalReplies = useMemo(() => {
    return mergedComments.map((c) => {
      const extra = localReplies[c.id] || [];
      if (!extra.length) return c;
      return { ...c, replies: [...(c.replies || []), ...extra] };
    });
  }, [mergedComments, localReplies]);

  const showCommentsSkeleton =
    (commentsLoading || (shouldFetchPost && postDetailsLoading)) &&
    mergedComments.length === 0;

  return {
    resolvedPost,
    images,
    reactionSummary,
    createdAtLabel,
    isDetailsLoading: shouldFetchPost && postDetailsLoading,
    commentsWithLocalReplies,
    commentsLoading,
    hasNextPage,
    loadMore,
    handleReplyAdded,
    postId,
    showCommentsSkeleton,
  };
};
