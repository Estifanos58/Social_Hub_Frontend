"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Smile, Image as ImageIcon, Send, X, Loader2 } from "lucide-react";
import { EmojiPicker } from "@ferrucc-io/emoji-picker";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUserStore } from "@/store/userStore";
import { CREATE_MESSAGE } from "@/graphql/mutations/message/CreateMessage";
import {
  ChatHeaderSkeleton,
  EmptyState,
  MessagesSkeleton,
} from "@/components/shared/skeleton/MessagePageSkeleton";
import { useMessageComposer } from "@/hooks/message/useMessageComposer";
import { useMessagesBetweenUsers } from "@/hooks/message/useMessagesBetweenUsers";
import { Avatar, ChatHeader, MessageBubble } from "@/components/custom/message/MessagePageCommponents";
import { useTypping } from "@/hooks/message/useTypping";
import { ChatroomDetailModal } from "@/components/modal/ChatroomDetailModal";
import { userMessageStore } from "@/store/messageStore";
import type { MessageEdge } from "@/lib/types";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

type PendingMessageState = {
  id: string;
  content: string;
  imagePreview: string | null;
  progress: number | null;
};

const PendingMessageBubble = ({
  message,
  userName,
  avatarUrl,
}: {
  message: PendingMessageState;
  userName: string;
  avatarUrl?: string | null;
}) => (
  <div className="flex items-start justify-start gap-3 opacity-80">
    <Avatar src={avatarUrl} alt={`${userName} avatar`} />
    <div className="max-w-lg rounded-2xl border border-white/10 bg-emerald-500/10 p-4 shadow-lg backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-white">{userName}</p>
        <div className="flex items-center gap-2 text-xs text-white/70">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Sending…</span>
        </div>
      </div>
      {message.content && (
        <p className="mt-2 whitespace-pre-wrap text-sm text-white/90">{message.content}</p>
      )}
      {message.imagePreview && (
        <div
          className="relative mt-3 w-full overflow-hidden rounded-lg border border-white/10"
          style={{ minHeight: 200 }}
        >
          <img
            src={message.imagePreview}
            alt="Uploading attachment"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 text-white">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-xs">
              {message.progress !== null
                ? `Uploading… ${Math.round(message.progress)}%`
                : "Uploading…"}
            </span>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default function MessagePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const { user } = useUserStore();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [isDetailOpen, setDetailOpen] = useState(false);
  const selectedChatroomMeta = userMessageStore((state) => state.selectedChatroomMeta);
  const setSelectedChatroomMeta = userMessageStore((state) => state.setSelectedChatroomMeta);
  const [pendingMessage, setPendingMessage] = useState<PendingMessageState | null>(null);
  const pendingMessageIdRef = useRef<string | null>(null);

  const scrollToBottom = useCallback(
    (behavior: "auto" | "smooth" = "smooth") => {
      const container = scrollContainerRef.current;
      if (!container) return;

      requestAnimationFrame(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior,
        });
      });
    },
    []
  );

  const {
    sortedMessages,
    chatroomId,
    addMessage,
    loading,
    error,
    chatroomMeta,
  } = useMessagesBetweenUsers({
    otherUserId: id,
    limit: 50,
    currentUserId: user?.id ?? null,
    skip: !user,
  });

  const [sendMessage, { loading: sending }] = useMutation(CREATE_MESSAGE);

  const activeChatroomMeta = chatroomMeta?.id ? chatroomMeta : selectedChatroomMeta ?? chatroomMeta;
  const isGroupChat = activeChatroomMeta?.isGroup ?? false;

  const handleMessageSent = useCallback(
    (message: MessageEdge) => {
      setPendingMessage((current) => {
        if (current && current.id === pendingMessageIdRef.current) {
          return null;
        }
        return current;
      });
      pendingMessageIdRef.current = null;
      addMessage(message);
    },
    [addMessage],
  );

  const handleComposerError = useCallback(() => {
    setPendingMessage(null);
    pendingMessageIdRef.current = null;
  }, []);

  const {
    messageInput,
    handleInputChange,
    handleSendMessage,
    handleEmojiSelect,
    toggleEmojiPicker,
    showEmojiPicker,
    canSend,
    textareaRef,
    emojiWrapperRef,
    selectedImage,
    handleFileChange,
    clearSelectedImage,
    uploadProgress,
    isUploading,
    fileInputRef,
    openFilePicker,
  } = useMessageComposer({
    chatroomId,
    otherUserId: id,
    currentUserId: user?.id ?? null,
    isGroupChat,
    isSending: sending,
    sendMessage,
    onMessageSent: handleMessageSent,
    onError: handleComposerError,
  });

  const { typingUsers, handleUserStartedTyping, handleUserStoppedTyping } = useTypping(
    chatroomId,
    user?.id ?? null
  );

  const isSending = sending || isUploading;

  useEffect(() => {
    if (!pendingMessage?.imagePreview) return;
    if (uploadProgress === null) return;

    setPendingMessage((current) => {
      if (!current || !current.imagePreview) return current;
      if (current.progress === uploadProgress) return current;
      return { ...current, progress: uploadProgress };
    });
  }, [pendingMessage, uploadProgress]);

  useEffect(() => {
    if (chatroomMeta?.id) {
      setSelectedChatroomMeta(chatroomMeta);
    }
  }, [chatroomMeta, setSelectedChatroomMeta]);

  const detailChatroomId = chatroomId ?? (isGroupChat ? id : null);
  const detailOtherUserId = isGroupChat ? undefined : id;

  useEffect(() => {
    if (loading) return;
    const behavior = sortedMessages.length <= 1 ? "auto" : "smooth";
    scrollToBottom(behavior);
  }, [loading, scrollToBottom, sortedMessages]);

  const handleSendMessageWithPending = useCallback(async () => {
    if (!canSend) return;

    const pendingId = `pending-${Date.now()}`;
    const trimmedContent = messageInput.trim();

    pendingMessageIdRef.current = pendingId;

    setPendingMessage({
      id: pendingId,
      content: trimmedContent,
      imagePreview: selectedImage?.preview ?? null,
      progress: selectedImage ? 0 : null,
    });

    scrollToBottom("smooth");

    const success = await handleSendMessage();
    await handleUserStoppedTyping();

    setPendingMessage((current) => {
      if (!current || current.id !== pendingId) return current;
      return null;
    });

    if (pendingMessageIdRef.current === pendingId) {
      pendingMessageIdRef.current = null;
    }

    if (!success) {
      return;
    }
  }, [canSend, handleSendMessage, handleUserStoppedTyping, messageInput, scrollToBottom, selectedImage]);

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Sign in to view your messages.
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-gray-900 text-white">
      <div className="flex flex-1 flex-col overflow-hidden border border-white/10 bg-gray-900 shadow-2xl">
        <div className="sticky top-0 z-20 border-b border-white/10 bg-gray-900/95 backdrop-blur">
          {loading ? (
            <ChatHeaderSkeleton />
          ) : (
            <ChatHeader
              {...activeChatroomMeta}
              onShowDetail={() => setDetailOpen(true)}
            />
          )}
        </div>
        <div ref={scrollContainerRef} className="flex flex-1  scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 overflow-y-scroll  flex-col">
          <div
            
            className="flex-1 px-6 py-8 "
          >
            {loading && <MessagesSkeleton />}
            {!loading && error && (
              <div className="flex h-full items-center justify-center text-center text-sm text-red-400">
                Failed to load messages. Please try again later.
              </div>
            )}
            {!loading && !error && (sortedMessages.length > 0 || pendingMessage) && (
              <div className="flex flex-col gap-6">
                {sortedMessages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={message.user?.id === user.id}
                  />
                ))}
                {pendingMessage && (
                  <PendingMessageBubble
                    key={pendingMessage.id}
                    message={pendingMessage}
                    userName={user.firstname}
                    avatarUrl={user.avatarUrl}
                  />
                )}
              </div>
            )}
            {!loading && !error && sortedMessages.length === 0 && !pendingMessage && (
              <EmptyState />
            )}
            {typingUsers.length > 0 && (
              <div className="mt-2 text-sm text-white">
                {typingUsers.map((u) => u.firstname).join(", ")} {" "}
                {typingUsers.length === 1 ? "is" : "are"} typing...
              </div>
            )}
            <div className="h-4" />
          </div>
          <div className="sticky bottom-10 md:bottom-0 z-20 border-t border-white/10 bg-gray-900/95 px-4 py-4 backdrop-blur sm:px-6">
            {selectedImage && (
              <div className="mb-3 flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 overflow-hidden rounded-lg border border-white/10 bg-black/60">
                    <img
                      src={selectedImage.preview}
                      alt="Selected attachment"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {/* <div className="text-sm text-white/70">
                    {isUploading && uploadProgress !== null
                      ? `Uploading… ${uploadProgress}%`
                      : "Ready to send"}
                  </div> */}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearSelectedImage}
                  aria-label="Remove image"
                  className="text-white/70 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="relative flex items-center flex-1">
                <Textarea
                  ref={textareaRef}
                  value={messageInput}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    handleUserStartedTyping();
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (canSend) {
                        void handleSendMessageWithPending();
                      } else {
                        void handleUserStoppedTyping();
                      }
                    }
                  }}
                  onBlur={() => {
                    void handleUserStoppedTyping();
                  }}
                  placeholder="Write a message…"
                  rows={1}
                  className="min-h-0 resize-none bg-white/5 text-sm text-white placeholder:text-white/40"
                />
                <div className="right-2 flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-white/70"
                    onClick={openFilePicker}
                    disabled={isSending}
                    aria-label="Attach image"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <div ref={emojiWrapperRef} className="relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-white/70"
                      onClick={toggleEmojiPicker}
                      aria-label="Add emoji"
                      aria-expanded={showEmojiPicker}
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                    {showEmojiPicker && (
                      <div
                        className="absolute bottom-full right-0 z-50 mb-3 w-64 max-w-xs overflow-y-auto rounded-2xl border border-white/10 bg-zinc-900/95 p-3 shadow-2xl backdrop-blur sm:w-72"
                        style={{ maxHeight: "60vh" }}
                        data-theme="dark"
                      >
                        <EmojiPicker
                          className="border-0 bg-transparent text-white"
                          emojiSize={24}
                          emojisPerRow={8}
                          onEmojiSelect={handleEmojiSelect}
                        >
                          <EmojiPicker.Header className="pb-2">
                            <EmojiPicker.Input
                              placeholder="Search emoji"
                              className="w-full rounded-md border border-white/10 bg-white/10 px-2 py-1 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                            />
                          </EmojiPicker.Header>
                          <EmojiPicker.Group>
                            <EmojiPicker.List
                              hideStickyHeader
                              containerHeight={240}
                            />
                          </EmojiPicker.Group>
                        </EmojiPicker>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Button
                type="button"
                onClick={() => {
                  void handleSendMessageWithPending();
                }}
                disabled={!canSend}
                size="icon"
                className="h-12 w-12 rounded-full bg-emerald-500/80 text-white hover:bg-emerald-400/90 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Send message"
              >
                {isSending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {uploadProgress !== null && isUploading && (
              <p className="mt-2 text-xs text-white/60">
                Uploading image… {uploadProgress}%
              </p>
            )}
          </div>
        </div>
      </div>
      <ChatroomDetailModal
        open={isDetailOpen}
        onOpenChange={setDetailOpen}
        chatroomId={detailChatroomId}
        otherUserId={detailOtherUserId}
        meta={activeChatroomMeta}
      />
    </div>
  );
}
