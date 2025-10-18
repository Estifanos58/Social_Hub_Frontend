"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { GET_USERS_TO_FOLLOW } from "@/graphql/queries/user/getUsersToFollow";
import { useQuery } from "@apollo/client/react";
import { GetUsersToFollowQuery } from "@/gql/graphql";
import { RightSideFooterLinks } from "@/lib/links";
import SidebarContact, { RightSideLoading } from "./SidebarContact";
import { useUserStore } from "@/store/userStore";

function RightSideBar() {
  const { data, loading, error } = useQuery<GetUsersToFollowQuery>(
    GET_USERS_TO_FOLLOW,
    {
      variables: { limit: 10, offset: 0 },
      fetchPolicy: "cache-and-network",
    }
  );

  const { user, usersToFollow, setUsersToFollow } = useUserStore();

  useEffect(() => {
    if (!loading && data?.GetUsersToFollow?.users) {
      setUsersToFollow(data.GetUsersToFollow.users as any);
    }
  }, [loading, data, setUsersToFollow]);

  const year = new Date().getFullYear();

  return (
    <div className="hidden md:flex w-[350px] border-l border-gray-800 bg-gray-900 flex-col justify-between p-4">
      <Link href={`/profile/${user?.id}`}>
      <div className="flex items-center mb-6 space-x-3 bg-gray-800/60 rounded-xl px-4 py-2 cursor-pointer hover:bg-gray-700/70 transition">
        <Image
          src={user?.avatarUrl ? user.avatarUrl : "/noAvatar.png"}
          alt="User Avatar"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover border border-gray-700"
        />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">
            {user?.firstname || "Guest"}
          </span>
          <span className="text-xs text-gray-400">View profile</span>
        </div>
      </div>
      </Link>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-300 font-semibold text-xl">
            Suggested for you
          </h2>
          <button className="text-xs text-gray-400 hover:underline">
            See All
          </button>
        </div>

        <div className="space-y-3">
          {loading ? (
            <RightSideLoading />
          ) : error ? (
            <p className="text-red-500 text-sm">Failed to load suggestions</p>
          ) : usersToFollow && usersToFollow.length > 0 ? (
            usersToFollow.map((user: any) => (
              <SidebarContact key={user.id} user={user} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Image
                src="/noAvatar.png"
                width={60}
                height={60}
                alt="no users"
                className="opacity-50 mb-3"
              />
              <p className="text-gray-400 text-sm font-medium">
                No users to follow found
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-[11px] text-gray-500 space-y-2">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {RightSideFooterLinks.map((link) => (
            <button key={link.label} className="hover:underline cursor-pointer">
              {link.label}
            </button>
          ))}
        </div>
        <p className="text-gray-600">© {year} SocialHub By Estifanos Kebede</p>
      </div>
    </div>
  );
}

export default RightSideBar;
