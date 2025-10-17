"use client";

import Image from "next/image";
import { useFollowersPopup } from "../../../../hooks/user/useFollowersPopup";
import { formatBio } from "@/lib/utils";

interface FollowersPopUpProps {
  setShowPopup: (value: boolean) => void;
  setIsCollapsed: (value: boolean) => void;
}

function FollowersPopUp({ setShowPopup, setIsCollapsed }: FollowersPopUpProps) {
  const {
    activeTab,
    setActiveTab,
    currentList,
    totalFollowers,
    totalFollowing,
    loading,
    scrollRef,
    pendingUnfollowUser,
    unfollowError,
    unfollowLoading,
    handleScroll,
    handleOpenUnfollowModal,
    handleConfirmUnfollow,
    handleCloseUnfollowModal,
  } = useFollowersPopup();

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
                  <p className="text-gray-400 text-sm">{formatBio(user.bio)}</p>
                </div>
              </div>
              <button
                onClick={() => handleOpenUnfollowModal(user)}
                className="px-4 ml-5 py-1.5 rounded-full text-sm font-medium bg-gray-700 text-white hover:bg-gray-600 transition-colors"
              >
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

      {pendingUnfollowUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white">
              Unfollow {pendingUnfollowUser.firstname}?
            </h3>
            <p className="mt-2 text-sm text-gray-300">
              If you unfollow this user, their posts will no longer appear in your feed.
            </p>
            {unfollowError && (
              <p className="mt-3 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {unfollowError}
              </p>
            )}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleCloseUnfollowModal}
                className="rounded-full px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800"
                disabled={unfollowLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUnfollow}
                className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={unfollowLoading}
              >
                {unfollowLoading ? "Unfollowing..." : "Yes, unfollow"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FollowersPopUp;
