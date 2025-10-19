"use client";

import type { ReactNode } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import Searching, { MessageSkeletonList } from "./Searching";
import { useUserChatrooms } from "@/hooks/chatroom/useUserChatrooms";
import { userMessageStore } from "@/store/messageStore";
import { useGeneralStore } from "@/store/generalStore";
import { formatRelative } from "@/lib/utils";
import { ChatroomMeta, ChatroomListItem, DEFAULT_AVATAR } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { CreateGroupModal } from "../../../modal/CreateGroupModal";
import { useUserPresence } from "@/hooks/message/useUserPresence";


interface MessagePopUpProps {
  setShowPopup: (value: boolean) => void;
  setIsCollapsed: (value: boolean) => void;
}

function MessagePopUp({ setShowPopup, setIsCollapsed }: MessagePopUpProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { chatrooms, isInitialLoading, error, refetch } = useUserChatrooms();
  const setSelectedChatRoomId = userMessageStore((state) => state.setSelectedChatRoomId);
  const setSelectedChatroomMeta = userMessageStore((state) => state.setSelectedChatroomMeta);
  const [isCreateGroupOpen, setCreateGroupOpen] = useState(false);
  const { isMobile } = useGeneralStore();

  const directUserIds = useMemo(
    () =>
      chatrooms
        .filter((room) => !room.isGroup && room.otherUserId)
        .map((room) => room.otherUserId as string),
    [chatrooms],
  );

  const initialLastSeen = useMemo(() => {
    const snapshot: Record<string, string | null> = {};
    chatrooms.forEach((room) => {
      if (room.isGroup || !room.otherUserId) return;
      snapshot[room.otherUserId] = room.otherUserLastSeenAt ?? null;
    });
    return snapshot;
  }, [chatrooms]);

  const presence = useUserPresence({ userIds: directUserIds, initialLastSeen });

  const toChatroomMeta = useCallback(
    (room: ChatroomListItem | undefined): ChatroomMeta | null => {
      if (!room) return null;
      return {
        id: room.id,
        isGroup: room.isGroup,
        name: room.name,
        avatarUrl: room.avatarUrl ?? DEFAULT_AVATAR,
        subtitle: room.isGroup ? "Group chat" : "Direct message",
        otherUserId: room.otherUserId ?? null,
        otherUserLastSeenAt: room.otherUserLastSeenAt ?? null,
        isOnline: undefined,
        lastSeenAt: room.otherUserLastSeenAt ?? null,
      };
    },
    [],
  );

  const handleOpenChatroom = useCallback(
    (chatroomId: string, routeId: string, meta?: ChatroomMeta | null) => {
      setSelectedChatRoomId(chatroomId);
      const baseRoom = chatrooms.find((room) => room.id === chatroomId);
      let resolvedMeta = meta ?? toChatroomMeta(baseRoom);

      if (resolvedMeta && !resolvedMeta.isGroup) {
        const otherId = resolvedMeta.otherUserId ?? baseRoom?.otherUserId ?? null;
        const presenceState = otherId ? presence[otherId] : undefined;
        resolvedMeta = {
          ...resolvedMeta,
          otherUserId: otherId,
          otherUserLastSeenAt: baseRoom?.otherUserLastSeenAt ?? resolvedMeta.otherUserLastSeenAt ?? null,
          isOnline: presenceState?.isOnline ?? resolvedMeta.isOnline ?? false,
          lastSeenAt:
            presenceState?.lastSeenAt ??
            resolvedMeta.lastSeenAt ??
            baseRoom?.otherUserLastSeenAt ??
            null,
        };
      }

      if (resolvedMeta) {
        setSelectedChatroomMeta(resolvedMeta);
      }
      if (isMobile) {
        setShowPopup(false);
        setIsCollapsed(true);
      } else {
        setShowPopup(true);
        setIsCollapsed(true);
      }
      router.push(`/message/${routeId}`);
    },
    [chatrooms, isMobile, presence, router, setIsCollapsed, setSelectedChatRoomId, setSelectedChatroomMeta, setShowPopup, toChatroomMeta],
  );

  const handleGroupCreated = useCallback(
    async (chatroomId: string) => {
      await refetch();
      handleOpenChatroom(chatroomId, chatroomId);
    },
    [handleOpenChatroom, refetch],
  );

  const renderChatroomList = () => {
    if (isInitialLoading) {
      return <MessageSkeletonList count={5} />;
    }

    if (error) {
      return (
        <div className="space-y-4 py-8 text-center">
          <p className="text-gray-400">We couldn&apos;t load your conversations.</p>
          <button
            type="button"
            onClick={() => {
              void refetch();
            }}
            className="inline-flex items-center justify-center rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
          >
            Try again
          </button>
        </div>
      );
    }

    if (chatrooms.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-400">No conversations yet. Start one by searching for a user.</p>
        </div>
      );
    }

    const directMessages = chatrooms.filter((chatroom) => !chatroom.isGroup);
    const groupChats = chatrooms.filter((chatroom) => chatroom.isGroup);

    const renderSection = (
      title: string,
      rooms: typeof chatrooms,
  emptyState: string,
  action?: ReactNode,
    ) => (
      <div className="flex h-1/2 flex-col">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/80">
              {title}
            </h3>
            {action}
          </div>
          <span className="text-xs text-white/40">{rooms.length}</span>
        </div>
        <div className="mt-3 bg-white/20 h-[0.1px]" />
        <div className="mt-3 flex-1 overflow-y-auto">
          {rooms.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center text-xs text-gray-500">
              {emptyState}
            </div>
          ) : (
            <div className="space-y-3 pr-1">
              {rooms.map((chatroom) => {
                const lastMessage = chatroom.lastMessage;
                const lastMessagePreview = lastMessage
                  ? lastMessage.content?.trim()
                    ? lastMessage.content.trim()
                    : lastMessage.imageUrl
                    ? "Sent a photo"
                    : "New chat"
                  : "Start the conversation";
                const timestamp = lastMessage?.createdAt
                  ? formatRelative(lastMessage.createdAt)
                  : "";
                const chatroomMeta = toChatroomMeta(chatroom);
                const isDirect = !chatroom.isGroup;
                const otherUserId = isDirect ? chatroom.otherUserId ?? null : null;
                const presenceState = otherUserId ? presence[otherUserId] : undefined;
                const isOnline = Boolean(presenceState?.isOnline);
                const lastSeen = presenceState?.lastSeenAt ?? chatroom.otherUserLastSeenAt ?? null;
                const lastSeenLabel = !isOnline && lastSeen ? formatRelative(lastSeen) : null;

                return (
                  <button
                    key={chatroom.id}
                    type="button"
                    onClick={() => handleOpenChatroom(chatroom.id, chatroom.routeId, chatroomMeta)}
                    className="flex w-full items-center justify-between rounded-lg bg-gray-900/40 p-3 text-left transition hover:bg-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10">
                        <Image
                          src={chatroom.avatarUrl}
                          alt={chatroom.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        {isDirect && isOnline && (
                          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-gray-900 bg-emerald-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{chatroom.name}</p>
                        {isDirect && (
                          <p className="text-[11px] font-medium text-emerald-400/90">
                            {isOnline ? "Online now" : lastSeenLabel ? `Last seen ${lastSeenLabel}` : "Offline"}
                          </p>
                        )}
                        <p className="line-clamp-1 text-xs text-gray-400">{lastMessagePreview}</p>
                      </div>
                    </div>
                    {timestamp && <span className="text-xs text-gray-500">{timestamp}</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );

    return (
      <div className="flex h-full flex-col gap-6">
        {renderSection("Direct Messages", directMessages, "No direct messages yet.")}
        {renderSection(
          "Group Chats",
          groupChats,
          "No group chats yet.",
          (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setCreateGroupOpen(true)}
              className="size-8 text-white/70"
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Create group chat</span>
            </Button>
          ),
        )}
      </div>
    );
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Messages</h2>
        <Link href='/'>
        <button
          onClick={() => {
            setShowPopup(false);
            setIsCollapsed(false);
          }}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
        </Link>
      </div>
      <Searching
        scrollRef={scrollRef}
        defaultContent={
          <>
            {renderChatroomList()}
          </>
        }
      />
      <CreateGroupModal
        open={isCreateGroupOpen}
        onOpenChange={setCreateGroupOpen}
        onCreated={handleGroupCreated}
      />
    </div>
  );
}

export default MessagePopUp;