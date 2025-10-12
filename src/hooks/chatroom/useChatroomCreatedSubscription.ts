import { useCallback, useMemo } from "react";
import { useSubscription } from "@apollo/client/react";

import { CHATROOM_CREATED_SUBSCRIPTION } from "@/graphql/subscriptions/ChatroomCreated";
import { ChatroomListItem } from "@/lib/types";
import { useUserStore } from "@/store/userStore";
import { userMessageStore } from "@/store/messageStore";
import {
  buildChatroomListItem,
  ChatroomCreatedPayload,
} from "./chatroomList.helpers";

interface SubscriptionVariables {
  otherUserId: string;
}

interface SubscriptionData {
  chatroomCreated: ChatroomCreatedPayload | null;
}

type SubscriptionDataPayload = {
  data?: {
    data?: SubscriptionData | null;
  };
};

export const useChatroomCreatedSubscription = ({
  enabled = true,
  onChatroomCreated,
  onError,
}: {
  enabled?: boolean;
  onChatroomCreated?: (chatroom: ChatroomListItem) => void;
  onError?: (error: unknown) => void;
} = {}): void => {
  const user = useUserStore((state) => state.user);
  const subscriberId = user?.id ?? null;

  const variables = useMemo<SubscriptionVariables | undefined>(() => {
    if (!enabled || !subscriberId) return undefined;
    return { otherUserId: subscriberId };
  }, [enabled, subscriberId]);

  const handleData = useCallback(
    ({ data }: SubscriptionDataPayload) => {
      const payload = data?.data?.chatroomCreated;
      if (!payload?.chatroom || !subscriberId) return;

      const mapped = buildChatroomListItem(payload.chatroom, subscriberId, payload);
      if (!mapped) return;

      const exists = userMessageStore
        .getState()
        .chatrooms.some((room) => room.id === mapped.id);

      if (!exists) {
        onChatroomCreated?.(mapped);
      }
    },
    [subscriberId, onChatroomCreated],
  );

  const handleError = useCallback(
    (err: unknown) => {
      if (onError) {
        onError(err);
      } else {
        console.error("chatroomCreated subscription error", err);
      }
    },
    [onError],
  );

  useSubscription<SubscriptionData, SubscriptionVariables>(
    CHATROOM_CREATED_SUBSCRIPTION,
    {
      variables: (variables ?? { otherUserId: "" }) as SubscriptionVariables,
      skip: !variables,
      shouldResubscribe: () => true,
      onData: handleData,
      onError: handleError,
    },
  );
};