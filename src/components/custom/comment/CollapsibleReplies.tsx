"use client";
import React, { useState } from "react";
import { CommentNode, CommentItem } from "./CommentItem";
import { CreatedComment } from "@/hooks/comment/useCommentSection";

interface CollapsibleRepliesProps {
  comment: CommentNode;
  postId: string;
  depth: number;
  maxDepth?: number;
  onReplyAdded?: (parentId: string, reply: CreatedComment) => void;
}

export const CollapsibleReplies: React.FC<CollapsibleRepliesProps> = ({ comment, postId, depth, maxDepth = 2, onReplyAdded }) => {
  const [expanded, setExpanded] = useState(true);
  if (!comment.replies || comment.replies.length === 0) return null;
  return (
    <div className="mt-3 space-y-3 border-l border-gray-800/70 pl-4">
      <button
        type="button"
        className="text-[10px] text-gray-500 hover:text-gray-300"
        onClick={() => setExpanded(e => !e)}
      >
        {expanded ? "Hide" : "Show"} {comment.replies.length} repl{comment.replies.length === 1 ? "y" : "ies"}
      </button>
      {expanded && comment.replies.map(r => (
        <CommentItem
          key={r.id}
          comment={r}
          postId={postId}
          depth={depth + 1}
          onReplyAdded={onReplyAdded}
          maxDepth={maxDepth}
        />
      ))}
    </div>
  );
};