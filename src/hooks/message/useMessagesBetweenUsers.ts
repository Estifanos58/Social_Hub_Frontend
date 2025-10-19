import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery, useSubscription } from '@apollo/client/react';

import { GET_MESSAGES } from '@/graphql/queries/message/getMessages';
import { NEW_MESSAGE_SUBSCRIPTION } from '@/graphql/subscriptions/NewMessageSubscription';
import { ChatroomMeta, DEFAULT_AVATAR, MessageEdge } from '@/lib/types';

interface UseMessagesBetweenUsersOptions {
  otherUserId: string;
  limit?: number;
  currentUserId?: string | null;
  skip?: boolean;
}

interface MessagesBetweenUsersQuery {
  messagesBetweenUsers: MessageEdge[];
}

interface MessagesBetweenUsersVariables {
  otherUserId: string;
  limit: number;
}

interface NewMessageSubscriptionData {
  newMessage: MessageEdge | null;
}

interface NewMessageSubscriptionVariables {
  chatroomId?: string | null;
  userId?: string | null;
}

export const useMessagesBetweenUsers = ({
  otherUserId,
  limit = 50,
  currentUserId,
  skip = false,
}: UseMessagesBetweenUsersOptions) => {
  const [chatroomId, setChatroomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageEdge[]>([]);


  const {
    data,
    loading: queryLoading,
    error,
    refetch,
  } = useQuery<MessagesBetweenUsersQuery, MessagesBetweenUsersVariables>(GET_MESSAGES, {
    variables: {
      otherUserId,
      limit,
    },
    fetchPolicy: 'network-only',
    skip,
  });

  useEffect(() => {
    if (!data?.messagesBetweenUsers) {
      if (skip) {
        setMessages([]);
        setChatroomId(null);
      }
      return;
    }

    const fetchedMessages = data.messagesBetweenUsers ?? [];
    setMessages(fetchedMessages);

    const foundChatroomId =
      fetchedMessages.find((message) => message.chatroom?.id)?.chatroom?.id ?? null;
    if (foundChatroomId) {
      setChatroomId(foundChatroomId);
    }
  }, [data, skip]);

  const addMessage = useCallback((incoming: MessageEdge | undefined | null) => {
    if (!incoming) return;

    setMessages((prev) => {
      if (prev.some((message) => message.id === incoming.id)) {
        return prev;
      }
      return [...prev, incoming];
    });

    setChatroomId((current) => incoming.chatroom?.id ?? current ?? null);
  }, []);

  const subscriptionVariables = useMemo<NewMessageSubscriptionVariables | undefined>(() => {
    if (skip) return undefined;
    if (!chatroomId || !currentUserId) return undefined;

    return {
      chatroomId,
      userId: currentUserId,
    };
  }, [chatroomId, currentUserId, skip]);
  useSubscription<NewMessageSubscriptionData, NewMessageSubscriptionVariables>(
    NEW_MESSAGE_SUBSCRIPTION,
    {
      variables: subscriptionVariables,
      skip: !subscriptionVariables,
      shouldResubscribe: () => true,
      onData: ({ data: subscriptionData }) => {
        const incoming = subscriptionData?.data?.newMessage ?? null;
        addMessage(incoming ?? null);
      },
      onError: (subscriptionError) => {
        console.error('New message subscription error:', subscriptionError);
      },
    },
  );

  const sortedMessages = useMemo(
    () =>
      [...messages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
    [messages],
  );

  const chatroomMeta: ChatroomMeta = useMemo(() => {
    const chatroom = sortedMessages.find((item) => item.chatroom)?.chatroom;
    const isGroup = chatroom?.isGroup ?? false;

    if (!chatroom) {
      return {
        id: null,
        isGroup: false,
        name: 'Conversation',
        avatarUrl: DEFAULT_AVATAR,
        subtitle: null,
        otherUserId: null,
        otherUserLastSeenAt: null,
        isOnline: undefined,
        lastSeenAt: null,
      };
    }

    if (isGroup) {
      return {
        id: chatroom.id,
        isGroup,
        name: chatroom.name || 'Group chat',
        avatarUrl: chatroom.avatarUrl || DEFAULT_AVATAR,
        subtitle: `${chatroom.memberships?.length ?? 0} participants`,
        otherUserId: null,
        otherUserLastSeenAt: null,
        isOnline: undefined,
        lastSeenAt: null,
      };
    }

    const otherMember = chatroom.memberships?.find(
      (member) => member.userId !== currentUserId,
    );
    const otherUser = otherMember?.user;

    return {
      id: chatroom.id,
      isGroup,
      name: otherUser?.firstname ?? 'Direct chat',
      avatarUrl: otherUser?.avatarUrl || DEFAULT_AVATAR,
      subtitle: otherUser?.lastname ?? null,
      otherUserId: otherUser?.id ?? null,
      otherUserLastSeenAt: otherUser?.lastSeenAt ?? null,
      isOnline: undefined,
      lastSeenAt: otherUser?.lastSeenAt ?? null,
    };
  }, [sortedMessages, currentUserId]);

  return {
    messages,
    sortedMessages,
    chatroomId,
    addMessage,
    loading: skip ? false : queryLoading,
    error,
    chatroomMeta,
    refetch,
  };
};
