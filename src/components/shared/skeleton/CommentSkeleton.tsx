"use client";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export const CommentSkeleton: React.FC = () => (
  <div className="flex gap-3">
    <Skeleton className="w-8 h-8 rounded-full bg-gray-700" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-3 w-32 bg-gray-700" />
      <Skeleton className="h-3 w-56 bg-gray-700" />
    </div>
  </div>
);

export const CommentSkeletonList: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <CommentSkeleton key={i} />
    ))}
  </div>
);
