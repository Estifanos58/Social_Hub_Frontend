"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Post } from "@/lib/types";
import React from "react";
import { CommentSection } from "../custom/comment/CommentSection";
import { formatRelative } from "@/lib/utils";
import { useGeneralStore } from "@/store/generalStore";
import { ReactionBar } from "./ReactionBar";
import Link from "next/link";
import Image from "next/image";


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
      className={`hidden md:!flex !items-center !justify-center !w-12 !h-12 !bg-black/50 hover:!bg-black/70 !backdrop-blur !rounded-full !z-20 !text-white !transition !duration-200 !border !border-white/20 !absolute top-1/2 -translate-y-1/2 ${direction === 'left' ? '!left-2' : '!right-2'}`}
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
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        },
      },
    ],
  };

  const {setSelectedPost} = useGeneralStore();

  return (
  <div className="w-svw bg-gray-900 border border-gray-800 rounded-none p-4 shadow-xl text-gray-100 mb-6 md:mx-6 md:mt-6 md:w-[600px] md:rounded-xl md:p-5">
      {/* Header */}
      <Link href={`/profile/${post.createdBy.id}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={post.createdBy.avatarUrl}
            alt="avatar"
            className="w-10 h-10 rounded-full border border-gray-700"
          />
          <div>
            <p className="font-semibold text-sm text-white">{post.createdBy.firstname}</p>
          </div>
        </div>
        <span
          className="text-xs text-gray-400"
          title={post.updatedAt ? `Edited at ${post.updatedAt}` : post.createdAt}
        >
          {post.updatedAt
            ? `Edited ${formatRelative(post.updatedAt)}`
            : formatRelative(post.createdAt)}
        </span>
      </div>
      </Link>

      {/* Content */}
      <p className="mb-4 text-sm text-gray-200">{post.content}</p>

      {/* Images */}
      {post.images.length > 0 && (
        <div className="mb-4 overflow-hidden rounded-lg border border-gray-800">
          <Slider {...sliderSettings} className="w-full">
            {post.images.map((img: any) => (
              <div key={img.id} className="px-0 md:px-1">
                <Image
                  src={img.url}
                  alt="post"
                  className="w-full h-48 object-cover md:h-[350px]"
                  width={600}
                  height={350}
                  sizes="(max-width: 768px) 100vw, 600px"
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
        className="mb-4"
      />
      <div className="bg-gray-900">
        <CommentSection postId={post.id} />
      </div>
    </div>
  );
};
