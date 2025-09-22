"use client";
import React from "react";

// A single skeleton block for a post while loading
export const PostSkeleton: React.FC<{ withImage?: boolean }> = ({ withImage = true }) => {
  return (
    <div className="m-6 w-[550px] bg-gray-800 rounded-xl p-4 shadow-lg animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-700" />
          <div className="space-y-2">
            <div className="h-3 w-28 bg-gray-700 rounded" />
            <div className="h-3 w-16 bg-gray-700 rounded" />
          </div>
        </div>
        <div className="h-3 w-20 bg-gray-700 rounded" />
      </div>

      {/* Content lines */}
      <div className="space-y-2 mb-3">
        <div className="h-3 w-full bg-gray-700 rounded" />
        <div className="h-3 w-5/6 bg-gray-700 rounded" />
        <div className="h-3 w-2/3 bg-gray-700 rounded" />
      </div>

      {/* Image placeholder */}
      {withImage && (
        <div className="mb-3 w-full h-[350px] bg-gray-700 rounded-lg" />
      )}

      {/* Actions */}
      <div className="flex items-center space-x-10 text-gray-500">
        <div className="h-6 w-20 bg-gray-700 rounded" />
        <div className="h-6 w-20 bg-gray-700 rounded" />
      </div>
    </div>
  );
};

// A list version
export const PostSkeletonList: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <PostSkeleton key={i} withImage={i % 2 === 0} />
      ))}
    </>
  );
};
