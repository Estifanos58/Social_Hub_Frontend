"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { GET_USERS_TO_FOLLOW } from "@/graphql/queries/user/getUsersToFollow";
import { Skeleton } from "@/components/ui/skeleton"; // assuming you have a shadcn/ui skeleton
import { useQuery } from "@apollo/client/react";
import { GetUsersToFollowQuery } from "@/gql/graphql";

function RightSideBar() {
  const { data, loading, error } = useQuery<GetUsersToFollowQuery>(GET_USERS_TO_FOLLOW, {
    variables: { limit: 10, offset: 0 },
    fetchPolicy: "cache-and-network",
  });

  const RightSideFooterLinks = [
    { label: "About" },
    { label: "Help" },
    { label: "Press" },
    { label: "API" },
    { label: "Jobs" },
    { label: "Privacy" },
    { label: "Terms" },
  ];

  const year = new Date().getFullYear();

  return (
    <div className="hidden md:flex w-[350px] border-l border-gray-800 bg-gray-900 flex-col justify-between p-4">
      {/* Suggested Section */}
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
          {loading &&
            [...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between animate-pulse"
              >
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full bg-gray-700" />
                  <Skeleton className="h-4 w-28 bg-gray-700" />
                </div>
                <Skeleton className="h-6 w-12 rounded-md bg-gray-700" />
              </div>
            ))}

          {!loading && data?.GetUsersToFollow?.users?.length! > 0 && (
            <>
              {data?.GetUsersToFollow?.users.map((user: any) => (
                <SidebarContact key={user.id} user={user} />
              ))}
            </>
          )}

          {!loading && data?.GetUsersToFollow?.users?.length === 0 && (
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

          {error && (
            <p className="text-red-500 text-sm">Failed to load suggestions</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-[11px] text-gray-500 space-y-2">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {RightSideFooterLinks.map((link) => (
            <button
              key={link.label}
              className="hover:underline cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </div>
        <p className="text-gray-600">© {year} SocialHub By Estifanos Kebede</p>
      </div>
    </div>
  );
}

const SidebarContact = ({
  user,
}: {
  user: { id: string; firstname: string; avatarUrl?: string };
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700">
        <Image
          src={user.avatarUrl || "/noAvatar.png"}
          alt={user.firstname}
          width={40}
          height={40}
          className="object-cover"
        />
      </div>
      <p className="text-base text-white font-medium">{user.firstname}</p>
    </div>
    <Button
      size="sm"
      className="bg-transparent hover:bg-gray-800 text-blue-400 text-xs px-3 py-1 rounded-md"
    >
      Follow
    </Button>
  </div>
);

export default RightSideBar;
