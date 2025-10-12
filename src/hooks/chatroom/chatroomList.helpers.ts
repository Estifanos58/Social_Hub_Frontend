import type { MessageEdge } from "@/lib/types";
import { ChatroomLastMessage, ChatroomListItem, DEFAULT_AVATAR } from "@/lib/types";

export interface ChatroomMemberEdge {
  userId: string;
  user?: {
    id: string;
    firstname: string;
    lastname?: string | null;
    avatarUrl?: string | null;
  } | null;
}

export interface ChatroomMessageEdge {
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

export interface ChatroomQueryEdge {
  id: string;
  name?: string | null;
  isGroup: boolean;
  avatarUrl?: string | null;
  updatedAt?: string | null;
  memberships?: ChatroomMemberEdge[];
  messages?: ChatroomMessageEdge[];
}

export interface ChatroomCreatedPayload extends ChatroomMessageEdge {
  chatroom?: ChatroomQueryEdge | null;
}

export const mapLastMessage = (
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

export const buildChatroomListItem = (
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
  const lastActivityAt =
    lastMessage?.createdAt ?? chatroom.updatedAt ?? new Date().toISOString();
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

const mapMessageEdgeToChatroomMessageEdge = (
  message: MessageEdge,
): ChatroomMessageEdge => ({
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
});

export const buildChatroomListItemFromMessageEdge = (
  message: MessageEdge,
  currentUserId: string | null,
): ChatroomListItem | null => {
  if (!message.chatroom) return null;

  const overrideMessage = mapMessageEdgeToChatroomMessageEdge(message);
  const chatroomEdge: ChatroomQueryEdge = {
    ...message.chatroom,
    updatedAt: message.chatroom.updatedAt ?? message.createdAt,
    messages: [overrideMessage],
  };

  return buildChatroomListItem(chatroomEdge, currentUserId, overrideMessage);
};