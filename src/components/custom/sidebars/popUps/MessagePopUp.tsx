"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Searching, { MessageSkeletonList } from "./Searching";
import { useUserChatrooms } from "@/hooks/message/useUserChatrooms";
import { userMessageStore } from "@/store/messageStore";
import { formatRelative } from "@/lib/utils";


interface MessagePopUpProps {
  setShowPopup: (value: boolean) => void;
  setIsCollapsed: (value: boolean) => void;
}

function MessagePopUp({ setShowPopup, setIsCollapsed }: MessagePopUpProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { chatrooms, isInitialLoading, error, refetch } = useUserChatrooms();
  const setSelectedChatRoomId = userMessageStore((state) => state.setSelectedChatRoomId);

  const handleOpenChatroom = (chatroomId: string, routeId: string) => {
    setSelectedChatRoomId(chatroomId);
    setShowPopup(true);
    setIsCollapsed(true);
    router.push(`/message/${routeId}`);
  };

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

    return (
      <div className="space-y-3">
        {chatrooms.map((chatroom) => {
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

          return (
            <button
              key={chatroom.id}
              type="button"
              onClick={() => handleOpenChatroom(chatroom.id, chatroom.routeId)}
              className="flex w-full items-center justify-between rounded-lg bg-gray-900/40 p-3 text-left transition hover:bg-gray-900"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={chatroom.avatarUrl}
                  alt={chatroom.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-white">{chatroom.name}</p>
                  <p className="line-clamp-1 text-xs text-gray-400">{lastMessagePreview}</p>
                </div>
              </div>
              {timestamp && <span className="text-xs text-gray-500">{timestamp}</span>}
            </button>
          );
        })}
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
    </div>
  );
}

export default MessagePopUp;