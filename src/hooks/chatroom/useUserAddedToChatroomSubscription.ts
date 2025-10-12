import { useCallback, useMemo } from "react";
import { useSubscription } from "@apollo/client/react";

import { USER_ADDED_TO_CHATROOM_SUBSCRIPTION } from "@/graphql/subscriptions/UserAddedToChatroom";
import { ChatroomListItem } from "@/lib/types";
import { useUserStore } from "@/store/userStore";
import { userMessageStore } from "@/store/messageStore";
import { buildChatroomListItem, ChatroomQueryEdge } from "./chatroomList.helpers";

interface SubscriptionVariables {
  otherUserId: string;
}

interface SubscriptionData {
  userAddedToChatroom: ChatroomQueryEdge | null;
}

type SubscriptionPayload = {
  data?: {
    data?: SubscriptionData | null;
  };
};

export const useUserAddedToChatroomSubscription = ({
  enabled = true,
  onChatroomAdded,
  onError,
}: {
  enabled?: boolean;
  onChatroomAdded?: (chatroom: ChatroomListItem) => void;
  onError?: (error: unknown) => void;
} = {}): void => {
  const user = useUserStore((state) => state.user);
  const subscriberId = user?.id ?? null;

  const variables = useMemo<SubscriptionVariables | undefined>(() => {
    if (!enabled || !subscriberId) return undefined;
    return { otherUserId: subscriberId };
  }, [enabled, subscriberId]);

  const handleData = useCallback(
    ({ data }: SubscriptionPayload) => {
      const chatroom = data?.data?.userAddedToChatroom;
      if (!chatroom || !subscriberId || !chatroom.isGroup) return;

      const mapped = buildChatroomListItem(
        chatroom,
        subscriberId,
        chatroom.messages?.[0] ?? null,
      );

      const exists = userMessageStore
        .getState()
        .chatrooms.some((room) => room.id === mapped.id);

      if (!exists) {
        onChatroomAdded?.(mapped);
      }
    },
    [onChatroomAdded, subscriberId],
  );

  const handleError = useCallback(
    (err: unknown) => {
      if (onError) {
        onError(err);
      } else {
        console.error("userAddedToChatroom subscription error", err);
      }
    },
    [onError],
  );

  useSubscription<SubscriptionData, SubscriptionVariables>(
    USER_ADDED_TO_CHATROOM_SUBSCRIPTION,
    {
      variables: (variables ?? { otherUserId: "" }) as SubscriptionVariables,
      skip: !variables,
      shouldResubscribe: () => true,
      onData: handleData,
      onError: handleError,
    },
  );
};
