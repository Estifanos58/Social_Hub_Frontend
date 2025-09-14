import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { useMutation } from "@apollo/client/react";
import { FOLLOW_USER } from "@/graphql/mutations/user/FollowUser";
import { useUserStore } from "@/store/userStore";

function SidebarContact({
  user,
}: {
  user: { id: string; firstname: string; avatarUrl?: string };
}) {
  const [followUser, { loading, error }] = useMutation(FOLLOW_USER);
  const { removeUserFromToFollow } = useUserStore()

  const handleFollow = (followingId: string) => {
    if(!followingId) return;

    followUser({
      variables: { followingId },
      onCompleted(data: any) {
        if(data.followUser){
          // Optionally update UI or state here
          removeUserFromToFollow(followingId)
        }
        console.log("Following User", data)
      }
    })
  }

  return (
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
        onClick={()=> handleFollow(user.id)}
      >
        { loading ? "loading.." : "Follow"}
      </Button>
    </div>
  );
}

export const RightSideLoading = () => {
  return [...Array(5)].map((_, i) => (
    <div key={i} className="flex items-center justify-between animate-pulse">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-10 w-10 rounded-full bg-gray-700" />
        <Skeleton className="h-4 w-28 bg-gray-700" />
      </div>
      <Skeleton className="h-6 w-12 rounded-md bg-gray-700" />
    </div>
  ));
};

export default SidebarContact;
