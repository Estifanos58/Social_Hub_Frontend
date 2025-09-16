"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useQuery } from "@apollo/client/react";
import { GET_FOLLOWERS } from "@/graphql/queries/user/getFollowers";
import { GET_FOLLOWING } from "@/graphql/queries/user/getFollowing";
import { GetFollowersQuery, GetFollowingQuery } from "@/gql/graphql";

interface FollowersPopUpProps {
  setShowPopup: (value: boolean) => void;
  setIsCollapsed: (value: boolean) => void;
}

function FollowersPopUp({ setShowPopup, setIsCollapsed }: FollowersPopUpProps) {
  const [activeTab, setActiveTab] = useState<"followers" | "following">("followers");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Followers Query
  const {
    data: followersData,
    loading: followersLoading,
    fetchMore: fetchMoreFollowers,
  } = useQuery<GetFollowersQuery>(GET_FOLLOWERS, {
    variables: { take: 10, skip: 0 },
    notifyOnNetworkStatusChange: true,
  });

  // Following Query
  const {
    data: followingData,
    loading: followingLoading,
    fetchMore: fetchMoreFollowing,
  } = useQuery<GetFollowingQuery>(GET_FOLLOWING, {
    variables: { take: 10, skip: 0 },
    notifyOnNetworkStatusChange: true,
  });

  // Current list & counts
  const currentList =
    activeTab === "followers"
      ? followersData?.GetFollowers?.users ?? []
      : followingData?.GetFollowing?.users ?? [];

const totalFollowers =
  activeTab === "followers"
    ? followersData?.GetFollowers?.totalFollowers ?? 0
    : followingData?.GetFollowing?.totalFollowers ?? 0;

const totalFollowing =
  activeTab === "followers"
    ? followersData?.GetFollowers?.totalFollowing ?? 0
    : followingData?.GetFollowing?.totalFollowing ?? 0;


  const loading = activeTab === "followers" ? followersLoading : followingLoading;

  // Load more on scroll
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 5) {
      if (activeTab === "followers" && followersData?.GetFollowers?.hasMore) {
        fetchMoreFollowers({
          variables: { skip: currentList.length, take: 10 },
        });
      }
      if (activeTab === "following" && followingData?.GetFollowing?.hasMore) {
        fetchMoreFollowing({
          variables: { skip: currentList.length, take: 10 },
        });
      }
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Connections</h2>
        <button
          onClick={() => {
            setShowPopup(false);
            setIsCollapsed(false);
          }}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Tabs with counts */}
      <div className="flex mb-6">
        <button
          onClick={() => setActiveTab("followers")}
          className={`flex-1 py-3 px-4 text-center font-semibold transition-colors ${
            activeTab === "followers"
              ? "text-white border-b-2 border-blue-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Followers ({totalFollowers})
        </button>
        <button
          onClick={() => setActiveTab("following")}
          className={`flex-1 py-3 px-4 text-center font-semibold transition-colors ${
            activeTab === "following"
              ? "text-white border-b-2 border-blue-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Following ({totalFollowing})
        </button>
      </div>

      {/* Users List */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto space-y-3"
      >
        {/* Skeleton Loader */}
        {loading &&
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 animate-pulse"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                <div>
                  <div className="w-24 h-3 bg-gray-700 rounded mb-2"></div>
                  <div className="w-16 h-3 bg-gray-700 rounded"></div>
                </div>
              </div>
              <div className="w-20 h-7 bg-gray-700 rounded-full"></div>
            </div>
          ))}

        {/* Users */}
        {!loading &&
          currentList.map((user: any) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Image
                  src={user.avatarUrl || "/noAvatar.png"}
                  alt={user.firstname}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-white font-medium">{user.firstname}</p>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
              </div>
              <button className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                Following
              </button>
            </div>
          ))}

        {/* Empty states */}
        {!loading && currentList.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">
              {activeTab === "followers"
                ? "No followers yet."
                : "Not following anyone yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FollowersPopUp;
