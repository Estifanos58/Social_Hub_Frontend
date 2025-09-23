"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Post } from "@/lib/types";
import React from "react";
import { CommentSection } from "../custom/CommentSection";
import { formatRelative } from "@/lib/utils";
import { useGeneralStore } from "@/store/generalStore";
import { ReactionBar } from "./ReactionBar";

export const PostDisplay = ({ post }: { post: Post }) => {
  // Utility: format ISO timestamp into compact relative time (e.g., 5d, 2w, 1min, 30s)
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  const {setSelectedPost} = useGeneralStore();

  return (
    <div className="m-6 w-[550px] bg-gray-800 rounded-xl p-4 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img
            src={post.createdBy.avatarUrl}
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold text-sm">{post.createdBy.firstname}</p>
          </div>
        </div>
        <span
          className="text-xs text-gray-500"
          title={post.updatedAt ? `Edited at ${post.updatedAt}` : post.createdAt}
        >
          {post.updatedAt
            ? `Edited ${formatRelative(post.updatedAt)}`
            : formatRelative(post.createdAt)}
        </span>
      </div>

      {/* Content */}
      <p className="mb-3 text-sm">{post.content}</p>

      {/* Images */}
      {post.images.length > 0 && (
        <div className="mb-3">
          <Slider {...sliderSettings}>
            {post.images.map((img: any) => (
              <div key={img.id} className="px-1">
                <img
                  src={img.url}
                  alt="post"
                  className="w-full h-[350px] object-cover rounded-lg"
                />
              </div>
            ))}
          </Slider>
        </div>
      )}

      {/* Actions */}
      <ReactionBar
        post={post}
        onCommentClick={() => setSelectedPost(post)}
        showCommentButton
        className="mb-3"
      />
        <div>
          <CommentSection postId={post.id} />
        </div>
    </div>
  );
};
