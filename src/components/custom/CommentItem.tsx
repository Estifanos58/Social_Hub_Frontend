"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelative } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CommentSection } from "./CommentSection";
import { CollapsibleReplies } from "./CollapsibleReplies";

export interface CommentNode {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  parentId?: string | null;
  replyCount?: number;
  createdBy: {
    id: string;
    firstname: string;
    lastname?: string;
    avatarUrl?: string;
  };
  replies?: CommentNode[];
}

interface CommentItemProps {
  comment: CommentNode;
  postId: string;
  depth?: number;
  onReplyAdded?: (parentId: string, reply: CommentNode) => void;
  maxDepth?: number;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  postId,
  depth = 0,
  onReplyAdded,
  maxDepth = 2,
}) => {
  const [showReply, setShowReply] = useState(false);
  // Reply logic handled via embedded CommentSection component

  return (
    <div className="flex gap-3 group">
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarImage src={comment?.createdBy.avatarUrl || "/placeholder.svg"} />
        <AvatarFallback className="bg-gray-700 text-white text-[10px]">
          {comment?.createdBy.firstname?.[0]}
          {comment?.createdBy.lastname?.[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white font-medium text-xs">
            {comment?.createdBy.firstname?.toLowerCase()}
            {comment?.createdBy.lastname?.toLowerCase()}
          </span>
          <span className="text-gray-500 text-[10px]">{formatRelative(comment?.createdAt)}</span>
        </div>
        <p className="text-xs text-gray-200 mt-1 leading-snug whitespace-pre-wrap">
          {comment?.content}
        </p>
        <div className="flex items-center gap-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {depth < maxDepth && (
            <button
              className="text-gray-400 text-[10px] hover:text-white"
              onClick={() => setShowReply(s => !s)}
              type="button"
            >
              {showReply ? "Cancel" : "Reply"}
            </button>
          )}
        </div>
        {showReply && depth < maxDepth && (
          <div className="mt-2">
            <CommentSection
              postId={postId}
              parentId={comment?.id}
              compact
              autoFocus
              placeholder="Reply..."
              onCreated={(created: any) => {
                if (onReplyAdded) onReplyAdded(comment?.id, created as any);
                setShowReply(false);
              }}
            />
          </div>
        )}
        {comment?.replies && comment?.replies.length > 0 && (
          <CollapsibleReplies
            comment={comment}
            postId={postId}
            depth={depth}
            maxDepth={maxDepth}
            onReplyAdded={onReplyAdded}
          />
        )}
      </div>
    </div>
  );
};
