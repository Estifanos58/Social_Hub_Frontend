'use client';

import RightSideBar from "@/components/custom/sidebars/RightSideBar";
import { PostDisplay } from "@/components/shared/PostDisplay";
import { PaginatedPostsDto } from "@/gql/graphql";
import { GET_POSTS } from "@/graphql/queries/post/GetPosts";
import { posts } from "@/lib/dummy";
import { useQuery } from "@apollo/client/react";
import React from "react";

function MainPage() {
  const {loading, data} = useQuery<any>(GET_POSTS, {
    variables: { take: 10, cursor: "" },
  })

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

console.log(data)

  

  return (
    <div className="flex-1 overflow-clip bg-gray-900 overflow-y-auto text-white">
      <div className="sticky top-0 z-50 bg-gray-900 shadow-md">
        {/* <TopBar /> */}
      </div>
      <div className="w-full flex justify-between ">
        <div className="flex-1 flex bg-gray-900 flex-col items-center">
          {data.getPosts.posts.map((post:any) => (
            <PostDisplay key={post.id} post={post} />
          ))}
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
