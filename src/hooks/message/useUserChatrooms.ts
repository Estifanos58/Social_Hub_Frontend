import { useEffect } from "react";
import { useQuery, useSubscription } from "@apollo/client/react";

import { GET_USER_CHATROOMS } from "@/graphql/queries/user/getUserChatrooms";
import { CHATROOM_CREATED_SUBSCRIPTION } from "@/graphql/subscriptions/ChatroomCreated";
import { useUserStore } from "@/store/userStore";
import { userMessageStore } from "@/store/messageStore";
import { ChatroomLastMessage, ChatroomListItem, DEFAULT_AVATAR } from "@/lib/types";

interface ChatroomMemberEdge {
  userId: string;
  user?: {
    id: string;
    firstname: string;
    lastname?: string | null;
    avatarUrl?: string | null;
  } | null;
}

interface ChatroomMessageEdge {
  id: string;
  content?: string | null;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  user?: {
    id: string;
    firstname: string;
    lastname?: string | null;
    avatarUrl?: string | null;
  } | null;
}

interface ChatroomQueryEdge {
  id: string;
  name?: string | null;
  isGroup: boolean;
  avatarUrl?: string | null;
  updatedAt: string;
  memberships?: ChatroomMemberEdge[];
  messages?: ChatroomMessageEdge[];
}

interface GetUserChatroomsQueryData {
  GetUserChatrooms: {
    chatrooms: ChatroomQueryEdge[];
  };
}

interface ChatroomCreatedSubscriptionData {
  chatroomCreated: (ChatroomMessageEdge & {
    chatroom?: {
      id: string;
      name?: string | null;
      isGroup: boolean;
      avatarUrl?: string | null;
      updatedAt: string;
      memberships?: ChatroomMemberEdge[];
    } | null;
  }) | null;
}

interface ChatroomCreatedSubscriptionVariables {
  otherUserId: string;
}

const mapLastMessage = (
  message: ChatroomMessageEdge | undefined | null,
): ChatroomLastMessage | null => {
  if (!message) return null;

  return {
    id: message.id,
    content: message.content ?? null,
    imageUrl: message.imageUrl ?? null,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
    isEdited: message.isEdited,
    user: message.user
      ? {
          id: message.user.id,
          firstname: message.user.firstname,
          lastname: message.user.lastname ?? null,
          avatarUrl: message.user.avatarUrl ?? null,
        }
      : null,
  };
};

const buildChatroomListItem = (
  chatroom: ChatroomQueryEdge,
  currentUserId: string | null,
  overrideMessage?: ChatroomMessageEdge | null,
): ChatroomListItem => {
  const members = chatroom.memberships ?? [];
  const isGroup = chatroom.isGroup;

  const otherMember = !isGroup
    ? members.find((member) => member.userId !== currentUserId)?.user ?? null
    : null;

  const name = isGroup
    ? chatroom.name?.trim() || "Group chat"
    : otherMember
    ? `${otherMember.firstname}${otherMember.lastname ? ` ${otherMember.lastname}` : ""}`
    : "Direct chat";

  const avatarUrl = isGroup
    ? chatroom.avatarUrl ?? DEFAULT_AVATAR
    : otherMember?.avatarUrl ?? DEFAULT_AVATAR;

  const lastMessage = mapLastMessage(overrideMessage ?? (chatroom.messages?.[0] ?? null));
  const lastActivityAt = lastMessage?.createdAt ?? chatroom.updatedAt ?? new Date().toISOString();
  const routeId = isGroup ? chatroom.id : otherMember?.id ?? chatroom.id;

  return {
    id: chatroom.id,
    isGroup,
    name,
    avatarUrl,
    routeId,
    lastMessage,
    lastActivityAt,
  };
};

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

  useSubscription<
    ChatroomCreatedSubscriptionData,
    ChatroomCreatedSubscriptionVariables
  >(CHATROOM_CREATED_SUBSCRIPTION, {
    skip: !currentUserId,
    variables: currentUserId ? { otherUserId: currentUserId } : { otherUserId: "" },
    onData: ({ data: subscriptionData }) => {
      const payload = subscriptionData?.data?.chatroomCreated;
      if (!payload?.chatroom) return;
      const mapped = buildChatroomListItem(payload.chatroom, currentUserId, payload);
      upsertChatroom(mapped);
    },
  });

  return {
    chatrooms,
    isInitialLoading: isChatroomsLoading,
    error,
    refetch,
  };
};
