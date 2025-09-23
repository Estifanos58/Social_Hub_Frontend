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
  // Custom larger arrows for the image slider
  interface ArrowProps {
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
  }

  const ArrowBase: React.FC<ArrowProps & { direction: 'left' | 'right' }> = ({ direction, onClick }) => (
    <button
      type="button"
      aria-label={direction === 'left' ? 'Previous image' : 'Next image'}
      onClick={onClick}
      className={`!flex !items-center !justify-center !w-12 !h-12 !bg-black/50 hover:!bg-black/70 !backdrop-blur !rounded-full !z-20 !text-white !transition !duration-200 !border !border-white/20 !absolute top-1/2 -translate-y-1/2 ${direction === 'left' ? '!left-2' : '!right-2'}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        {direction === 'left' ? (
          <path d="M15 18l-6-6 6-6" />
        ) : (
          <path d="M9 18l6-6-6-6" />
        )}
      </svg>
    </button>
  );

  const NextArrow: React.FC<ArrowProps> = (props) => <ArrowBase direction="right" {...props} />;
  const PrevArrow: React.FC<ArrowProps> = (props) => <ArrowBase direction="left" {...props} />;

  // Utility: format ISO timestamp into compact relative time (e.g., 5d, 2w, 1min, 30s)
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
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
        <div className="mb-3 relative group">
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
