import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";

import { GET_USER_CHATROOMS } from "@/graphql/queries/user/getUserChatrooms";
import { useUserStore } from "@/store/userStore";
import { userMessageStore } from "@/store/messageStore";
import { ChatroomListItem } from "@/lib/types";
import { buildChatroomListItem, ChatroomQueryEdge } from "./chatroomList.helpers";
import { useChatroomCreatedSubscription } from "./useChatroomCreatedSubscription";
import { useUserAddedToChatroomSubscription } from "./useUserAddedToChatroomSubscription";

interface GetUserChatroomsQueryData {
  GetUserChatrooms: {
    chatrooms: ChatroomQueryEdge[];
  };
}

interface UseUserChatroomsResult {
  chatrooms: ChatroomListItem[];
  isInitialLoading: boolean;
  error:  any | undefined;
  refetch: () => Promise<any>;
}

export const useUserChatrooms = (): UseUserChatroomsResult => {
  const { user } = useUserStore();
  const currentUserId = user?.id ?? null;

  const {
    chatrooms,
    setChatrooms,
    upsertChatroom,
    setChatroomsLoading,
    isChatroomsLoading,
    clearChatrooms,
  } = userMessageStore();

  const { data, loading, error, refetch } = useQuery<GetUserChatroomsQueryData>(
    GET_USER_CHATROOMS,
    {
      skip: !currentUserId,
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
    },
  );

  useEffect(() => {
    if (!currentUserId) {
      clearChatrooms();
      setChatroomsLoading(false);
    }
  }, [clearChatrooms, currentUserId, setChatroomsLoading]);

  useEffect(() => {
    if (!currentUserId) return;
    setChatroomsLoading(loading && !data);
  }, [currentUserId, data, loading, setChatroomsLoading]);

  useEffect(() => {
    if (!currentUserId) return;
    const chatroomEdges = data?.GetUserChatrooms?.chatrooms ?? [];
    if (chatroomEdges.length === 0) {
      setChatrooms([]);
      return;
    }

    const mapped = chatroomEdges.map((chatroom) =>
      buildChatroomListItem(chatroom, currentUserId, null),
    );
    setChatrooms(mapped);
  }, [currentUserId, data, setChatrooms]);

  useChatroomCreatedSubscription({
    enabled: Boolean(currentUserId),
    onChatroomCreated: upsertChatroom,
  });

  useUserAddedToChatroomSubscription({
    enabled: Boolean(currentUserId),
    onChatroomAdded: upsertChatroom,
  });

  return {
    chatrooms,
    isInitialLoading: isChatroomsLoading,
    error,
    refetch,
  };
};
