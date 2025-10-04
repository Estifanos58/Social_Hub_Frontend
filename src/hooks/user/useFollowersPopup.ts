import { useMutation, useQuery } from "@apollo/client/react";
import { useRef, useState } from "react";
import { GET_FOLLOWERS } from "@/graphql/queries/user/getFollowers";
import { GET_FOLLOWING } from "@/graphql/queries/user/getFollowing";
import { UNFOLLOW_USER } from "@/graphql/mutations/user/UnfollowUser";
import { GetFollowersQuery, GetFollowingQuery } from "@/gql/graphql";

export type FollowersTab = "followers" | "following";

const PAGE_SIZE = 10;

export const useFollowersPopup = () => {
  const [activeTab, setActiveTab] = useState<FollowersTab>("followers");
  const [pendingUnfollowUser, setPendingUnfollowUser] = useState<any>(null);
  const [unfollowError, setUnfollowError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    data: followersData,
    loading: followersLoading,
    fetchMore: fetchMoreFollowers,
    refetch: refetchFollowers,
  } = useQuery<GetFollowersQuery>(GET_FOLLOWERS, {
    variables: { take: PAGE_SIZE, skip: 0 },
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: followingData,
    loading: followingLoading,
    fetchMore: fetchMoreFollowing,
    refetch: refetchFollowing,
  } = useQuery<GetFollowingQuery>(GET_FOLLOWING, {
    variables: { take: PAGE_SIZE, skip: 0 },
    notifyOnNetworkStatusChange: true,
  });

  const [unfollowUser, { loading: unfollowLoading }] = useMutation(UNFOLLOW_USER);

  const isFollowersTab = activeTab === "followers";
  const activeData = isFollowersTab
    ? followersData?.GetFollowers
    : followingData?.GetFollowing;

  const currentList = activeData?.users ?? [];
  const totalFollowers = activeData?.totalFollowers ?? 0;
  const totalFollowing = activeData?.totalFollowing ?? 0;
  const loading = isFollowersTab ? followersLoading : followingLoading;

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

    if (scrollTop + clientHeight < scrollHeight - 5) {
      return;
    }

    const hasMore = isFollowersTab
      ? followersData?.GetFollowers?.hasMore
      : followingData?.GetFollowing?.hasMore;

    if (!hasMore) {
      return;
    }

    const fetchMore = isFollowersTab ? fetchMoreFollowers : fetchMoreFollowing;

    fetchMore({
      variables: { skip: currentList.length, take: PAGE_SIZE },
    });
  };

  const handleOpenUnfollowModal = (user: any) => {
    setUnfollowError(null);
    setPendingUnfollowUser(user);
  };

  const handleConfirmUnfollow = async () => {
    if (!pendingUnfollowUser) return;

    setUnfollowError(null);

    try {
      await unfollowUser({
        variables: { followingId: pendingUnfollowUser.id },
      });

      await Promise.all([
        refetchFollowing({
          take: Math.max(followingData?.GetFollowing?.users?.length ?? 0, PAGE_SIZE),
          skip: 0,
        }),
        refetchFollowers({
          take: Math.max(followersData?.GetFollowers?.users?.length ?? 0, PAGE_SIZE),
          skip: 0,
        }),
      ]);

      setPendingUnfollowUser(null);
    } catch (error) {
      console.error("Failed to unfollow user", error);
      setUnfollowError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  const handleCloseUnfollowModal = () => {
    setPendingUnfollowUser(null);
    setUnfollowError(null);
  };

  return {
    activeTab,
    setActiveTab,
    pendingUnfollowUser,
    unfollowError,
    unfollowLoading,
    scrollRef,
    currentList,
    totalFollowers,
    totalFollowing,
    loading,
    handleScroll,
    handleOpenUnfollowModal,
    handleConfirmUnfollow,
    handleCloseUnfollowModal,
  };
};
