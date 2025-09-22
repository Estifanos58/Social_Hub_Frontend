"use client";

import RightSideBar from "@/components/custom/sidebars/RightSideBar";
import { PostDisplay } from "@/components/shared/PostDisplay";
import { GET_POSTS } from "@/graphql/queries/post/GetPosts";
import { useQuery } from "@apollo/client/react";
import React from "react";
import { PostSkeletonList } from "@/components/shared/skeleton/PostSkeleton";

function MainPage() {
  const { loading, data, error } = useQuery<any>(GET_POSTS, {
    variables: { take: 10, cursor: "" },
    fetchPolicy: "cache-and-network",
  });

  const renderPosts = () => {
    if (loading) {
      return <PostSkeletonList count={4} />;
    }
    if (error) {
      return (
        <div className="mt-10 text-center text-red-400 text-sm">
          Failed to load posts.{" "}
          <button
            className="underline"
            onClick={() => location.reload()}
          >
            Retry
          </button>
        </div>
      );
    }
    if (!data || !data.getPosts || !data.getPosts.posts?.length) {
      return (
        <div className="mt-10 text-gray-500 text-sm">No posts yet.</div>
      );
    }
    return data.getPosts.posts.map((post: any) => (
      <PostDisplay key={post.id} post={post} />
    ));
  };

  return (
    <div className="flex-1 overflow-clip bg-gray-900 overflow-y-auto text-white">
      <div className="sticky top-0 z-50 bg-gray-900 shadow-md" />
      <div className="w-full flex justify-between ">
        <div className="flex-1 flex bg-gray-900 flex-col items-center">
          {renderPosts()}
        </div>
        <div className="hidden sticky top-0 lg:block  h-full border-l border-gray-700">
          <div className="sticky top-0 h-screen">
            <RightSideBar />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
