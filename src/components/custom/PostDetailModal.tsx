"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, X } from "lucide-react";
import { SelectedPost } from "@/store/generalStore";
import { CommentSection } from "./CommentSection";
import { formatRelative } from "@/lib/utils";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ReactionBar } from "../shared/ReactionBar";
import { usePostComments } from "@/hooks/usePostComments";
import React, { useState } from "react";
import { CommentSkeletonList } from "../shared/skeleton/CommentSkeleton";
import { CommentItem, CommentNode } from "./CommentItem";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useGeneralStore } from "@/store/generalStore";

interface PostDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: SelectedPost;
}

export function PostDetailModal({
  isOpen,
  onClose,
  post,
}: PostDetailModalProps) {
  const { setSelectedPost } = useGeneralStore();

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  const {
    comments: liveComments,
    loading: commentsLoading,
    loadMore,
    hasNextPage,
    totalCount,
  } = usePostComments({ postId: post?.id });

  // Merge server-fetched comments with any preloaded ones (avoid duplicates by id)
  const initialComments = post?.comments || [];
  const mergedCommentsMap = new Map<string, any>();
  [...initialComments, ...liveComments].forEach(c => {
    if (!mergedCommentsMap.has(c.id)) mergedCommentsMap.set(c.id, c);
  });
  const mergedComments = Array.from(mergedCommentsMap.values()) as CommentNode[];

  // Local state for newly added replies (not yet part of query results) keyed by parentId
  const [localReplies, setLocalReplies] = useState<Record<string, CommentNode[]>>({});

  const handleReplyAdded = (parentId: string, reply: CommentNode) => {
    setLocalReplies(prev => ({
      ...prev,
      [parentId]: prev[parentId] ? [...prev[parentId], reply] : [reply],
    }));
    toast.success("Reply added");
  };

  // Merge local replies into comment structure (shallow, for display only)
  const commentsWithLocalReplies: CommentNode[] = mergedComments.map(c => {
    const extra = localReplies[c.id] || [];
    if (!extra.length) return c;
    return { ...c, replies: [...(c.replies || []), ...extra] };
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
  <DialogContent className="lg:max-w-5xl w-full h-[85vh] p-0 bg-black border-gray-800 flex flex-col data-[state=open]:animate-none">
        <div className="flex h-full">
          {/* Left side - Image */}
          <div className="flex-1 bg-black flex items-center justify-center overflow-hidden relative border-r border-gray-800">
            {post?.images.length > 0 ? (
              <Slider {...sliderSettings} className="w-[400px] h-full">
                {post.images.map((img: any) => (
                  <div key={img.id} className="w-full h-full flex items-center justify-center px-6 py-4 bg-black">
                    <img
                      src={img.url}
                      alt="post image"
                      className="max-h-full max-w-full object-contain rounded-md shadow-lg"
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="text-gray-600 text-sm">No images</div>
            )}
          </div>

          {/* Right side - Post details */}
          <div className="w-96 bg-black border-l border-gray-800 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={post?.createdBy.avatarUrl || "/placeholder.svg"}
                  />
                  <AvatarFallback className="bg-gray-700 text-white">
                    {post?.createdBy.firstname[0]}
                    {post?.createdBy.lastname[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-white font-semibold text-sm">
                  {post?.createdBy.firstname.toLowerCase()}
                  {post?.createdBy.lastname.toLowerCase()}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-gray-800"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            {/* Comments section */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
              {/* Original post content card */}
              <div className="flex gap-3 pb-4 border-b border-gray-800">
                <Avatar className="w-9 h-9 flex-shrink-0">
                  <AvatarImage src={post?.createdBy.avatarUrl || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gray-700 text-white text-xs">
                    {post?.createdBy.firstname[0]}
                    {post?.createdBy.lastname[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-semibold text-sm truncate">
                      {post?.createdBy.firstname.toLowerCase()}{post?.createdBy.lastname.toLowerCase()}
                    </span>
                    <span className="text-gray-500 text-xs">• {formatRelative(post?.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-200 mt-1 whitespace-pre-wrap leading-relaxed">
                    {post?.content}
                  </p>
                </div>
              </div>

              {/* Comments dynamic */}
              {commentsLoading && mergedComments.length === 0 && (
                <CommentSkeletonList count={5} />
              )}

              {commentsWithLocalReplies.length > 0 && (
                <div className="space-y-5">
                  {commentsWithLocalReplies.map(comment => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      postId={post.id}
                      onReplyAdded={handleReplyAdded}
                    />
                  ))}
                </div>
              )}

              {!commentsLoading && commentsWithLocalReplies.length === 0 && (
                <div className="text-xs text-gray-500 text-center py-6">No comments yet. Be the first!</div>
              )}

              {hasNextPage && (
                <div className="pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => loadMore()}
                    className="w-full text-xs bg-gray-800/40 hover:bg-gray-800"
                  >
                    Load more comments
                  </Button>
                </div>
              )}
            </div>

            {/* Reactions + Comments input */}
            <div className="border-t border-gray-800 p-4 space-y-4 bg-gradient-to-b from-black to-gray-950">
              <ReactionBar
                post={{
                  id: post?.id,
                  reactionsCount: (post as any)?.reactionsCount ?? 0,
                  userReaction: (post as any)?.userReaction ?? null,
                  commentsCount: (post as any)?.comments?.length ?? 0,
                }}
                showCommentButton={false}
              />
              <div className="text-gray-400 text-xs">
                {formatRelative(post?.createdAt)}
              </div>
              <CommentSection postId={post?.id} />
            </div>
          </div>
        </div>

        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 text-white hover:bg-gray-800 z-10"
          onClick={() => {
            onClose();
            setSelectedPost(null);
          }}
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </Button>
      </DialogContent>
    </Dialog>
  );
}
