import RightSideBar from "@/components/custom/RightSideBar";
import TopBar from "@/components/custom/TopBar";
import { PostDisplay } from "@/components/shared/PostDisplay";
import { posts } from "@/lib/dummy";
import React from "react";

function MainPage() {
  return (
    <div className="flex-1 overflow-clip bg-gray-900 overflow-y-auto text-white">
      <div className="sticky top-0 z-50 bg-gray-900 shadow-md">
        <TopBar />
      </div>
      <div className="w-full flex justify-between ">
        <div className="flex-1 flex bg-gray-900 flex-col items-center">
          {posts.map((post) => (
            <PostDisplay key={post.id} post={post} />
          ))}
        </div>
        <div className="hidden sticky top-20 lg:block  h-full border-l border-gray-700">
          <div className="sticky top-[64px] h-[calc(100vh-64px)]">
            <RightSideBar />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
