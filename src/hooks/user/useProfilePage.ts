import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_USER_PROFILE } from "@/graphql/queries/user/getUserProfile";
import { useUserStore } from "@/store/userStore";
import { GetUserProfileQuery } from "@/gql/graphql";
import { useGeneralStore } from "@/store/generalStore";

export const useProfilePage = (userId?: string) => {
  const { user: currentUser } = useUserStore();
  const { setSelectedPost } = useGeneralStore();
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);
  const effectiveUserId = userId ?? currentUser?.id;
  const { data, loading, error } = useQuery<GetUserProfileQuery>(
    GET_USER_PROFILE,
    {
      variables: { userId: effectiveUserId },
      fetchPolicy: "cache-and-network",
      skip: !effectiveUserId,
    }
  );

  const profile = data?.GetUser;
  const account = profile?.user;

  const [isPrivate, setIsPrivate] = useState<boolean>(
    account?.isPrivate ?? false
  );

  const handleSelectPost = (post: any) => {
    setSelectedPost(post);
  };

  return {
    loading,
    error,
    profile,
    account,
    hoveredPost,
    setHoveredPost,
    isPrivate,
    setIsPrivate,
    handleSelectPost,
    currentUser,
  };
};
