"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { SelectedPost } from "@/store/generalStore";
import { CommentSection } from "./CommentSection";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ReactionBar } from "../shared/ReactionBar";
import React from "react";
import { CommentSkeletonList } from "../shared/skeleton/CommentSkeleton";
import { CommentItem } from "./CommentItem";
import { usePostDetailModal, sliderSettings } from "../../hooks/post/usePostDetailModal";

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
  const {
    resolvedPost,
    images,
    reactionSummary,
    createdAtLabel,
    isDetailsLoading,
    commentsWithLocalReplies,
    hasNextPage,
    loadMore,
    handleReplyAdded,
    postId,
    showCommentsSkeleton,
    commentsLoading
  } = usePostDetailModal(post);

  const createdBy = resolvedPost?.createdBy;

  const postContent = resolvedPost?.content ?? "";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="lg:max-w-5xl w-full h-[85vh] p-0 bg-gray-900 text-gray-100 border border-gray-800 flex flex-col data-[state=open]:animate-none">
        <div className="flex h-full">
          {/* Left side - Image */}
          <div className="flex-1 bg-gray-900 flex items-center justify-center overflow-hidden relative border-r border-gray-800">
            {isDetailsLoading && images.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 text-gray-500 text-sm">
                <div className="h-12 w-12 animate-spin rounded-full border-2 border-gray-700 border-t-transparent" />
                <span>Loading post...</span>
              </div>
            ) : images.length > 0 ? (
              <Slider {...sliderSettings} className="w-[400px] h-full">
                {images.map((img: any) => (
                  <div key={img.id ?? `image-${img.url}`} className="w-full h-full flex items-center justify-center px-6 py-4 bg-gray-900">
                    <img
                      src={img.url}
                      alt="post image"
                      className="max-h-full max-w-full object-contain rounded-md shadow-lg"
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="text-gray-500 text-sm">No images</div>
            )}
          </div>

          {/* Right side - Post details */}
          <div className="w-96 bg-gray-900 border-l border-gray-800 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={createdBy?.avatarUrl || "/placeholder.svg"}
                  />
                  <AvatarFallback className="bg-gray-800 text-white">
                    {createdBy?.firstname?.[0]}
                    {createdBy?.lastname?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-white font-semibold text-sm">
                  {createdBy?.firstname?.toLowerCase?.() ?? ""}
                  {createdBy?.lastname?.toLowerCase?.() ?? ""}
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
                  <AvatarImage src={createdBy?.avatarUrl || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gray-700 text-white text-xs">
                    {createdBy?.firstname?.[0]}
                    {createdBy?.lastname?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-semibold text-sm truncate">
                      {createdBy?.firstname?.toLowerCase?.() ?? ""}{createdBy?.lastname?.toLowerCase?.() ?? ""}
                    </span>
                    <span className="text-gray-500 text-xs">• {createdAtLabel}</span>
                  </div>
                  <p className="text-sm text-gray-200 mt-1 whitespace-pre-wrap leading-relaxed">
                    {postContent || ""}
                  </p>
                </div>
              </div>

              {/* Comments dynamic */}
              {showCommentsSkeleton && (
                <CommentSkeletonList count={5} />
              )}

              {commentsWithLocalReplies.length > 0 && (
                <div className="space-y-5">
                  {commentsWithLocalReplies.map(comment => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      postId={postId!}
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
                    className="w-full text-xs bg-gray-900/70 hover:bg-gray-800"
                  >
                    Load more comments
                  </Button>
                </div>
              )}
            </div>

            {/* Reactions + Comments input */}
            <div className="border-t border-gray-800 p-4 space-y-4 bg-gray-900">
              <ReactionBar
                post={{
                  id: postId!,
                  reactionsCount: reactionSummary.reactionsCount,
                  userReaction: reactionSummary.userReaction,
                  commentsCount: reactionSummary.commentsCount,
                }}
                showCommentButton={false}
              />
              <div className="text-gray-400 text-xs">
                {createdAtLabel}
              </div>
              <CommentSection postId={postId!} />
            </div>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
