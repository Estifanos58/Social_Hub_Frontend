'use client';

import clsx from 'clsx';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EmojiPicker } from '@ferrucc-io/emoji-picker';
import { Smile, Image as ImageIcon, Send, X, Loader2 } from 'lucide-react';
import { uploadImageToCloudinary } from '@/lib/uploadFile';
import { toast } from 'sonner';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';

const GET_MESSAGES = gql`
  query MessagesBetweenUsers($otherUserId: String!, $limit: Int, $offset: Int) {
    messagesBetweenUsers(otherUserId: $otherUserId, limit: $limit, offset: $offset) {
      id
      content
      imageUrl
      createdAt
      updatedAt
      isEdited
      user {
        id
        firstname
        lastname
        avatarUrl
      }
      chatroom {
        id
        name
        isGroup
        avatarUrl
        memberships {
          userId
          user {
            id
            firstname
            lastname
            avatarUrl
          }
        }
      }
    }
  }
`;
const CREATE_MESSAGE = gql`
  mutation CreateMessage(
    $chatroomId: String
    $otherUserId: String
    $content: String
    $imageUrl: String
  ) {
    createMessageMutation(
      chatroomId: $chatroomId
      otherUserId: $otherUserId
      content: $content
      imageUrl: $imageUrl
    ) {
      id
      content
      imageUrl
      createdAt
      updatedAt
      isEdited
      user {
        id
        firstname
        lastname
        avatarUrl
      }
      chatroom {
        id
      }
    }
  }
`;

type MessageEdge = {
  id: string;
  content?: string | null;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  user: {
    id: string;
    firstname: string;
    lastname?: string | null;
    avatarUrl?: string | null;
  };
  chatroom?: {
    id: string;
    name?: string | null;
    isGroup: boolean;
    avatarUrl?: string | null;
    memberships?: Array<{
      userId: string;
      user?: {
        id: string;
        firstname: string;
        lastname?: string | null;
        avatarUrl?: string | null;
      } | null;
    }>;
  } | null;
};

interface PageProps {
  params: {
    id: string;
  };
}

const DEFAULT_AVATAR = '/noAvatar.png';

const formatTime = (value?: string | null) => {
  if (!value) return '';
  try {
    const date = new Date(value);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  } catch (error) {
    return '';
  }
};

const formatEditedTime = (createdAt: string, updatedAt: string) => {
  if (!updatedAt || updatedAt === createdAt) return null;
  try {
    const updated = new Date(updatedAt);
    const time = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    }).format(updated);
    return `edited ${time}`;
  } catch (error) {
    return 'edited';
  }
};

const MessagesSkeleton = () => (
  <div className="flex flex-col gap-6 px-8 py-10">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-white/10 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 rounded bg-white/10 animate-pulse" />
          <div className="h-4 w-2/3 rounded bg-white/10 animate-pulse" />
          <div className="h-4 w-1/4 rounded bg-white/10 animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

const ChatHeaderSkeleton = () => (
  <div className="flex items-center gap-4 border-b border-white/10 bg-white/5 px-8 py-6">
    <div className="h-16 w-16 rounded-full bg-white/10 animate-pulse" />
    <div className="space-y-2">
      <div className="h-5 w-40 rounded bg-white/10 animate-pulse" />
      <div className="h-4 w-24 rounded bg-white/10 animate-pulse" />
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-white/70">
    <p className="text-lg font-semibold text-white">No messages yet</p>
    <p className="text-sm">Start the conversation by sending the first message.</p>
  </div>
);

const Avatar = ({ src, alt }: { src?: string | null; alt: string }) => (
  <div className="h-10 w-10 overflow-hidden rounded-full border border-white/10 bg-white/10">
    <img
      src={src || DEFAULT_AVATAR}
      alt={alt}
      className="h-full w-full object-cover"
    />
  </div>
);

const MessageBubble = ({ message, isOwn }: { message: MessageEdge; isOwn: boolean }) => {
  const editedLabel = formatEditedTime(message.createdAt, message.updatedAt);
  const bubble = (
    <div
      className={clsx('max-w-lg rounded-2xl border border-white/10 p-4 shadow-lg backdrop-blur', {
        'bg-emerald-500/10': isOwn,
        'bg-white/5': !isOwn,
      })}
    >
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm font-semibold text-foreground">
          {message.user?.firstname ?? 'Unknown'}
        </p>
        <span className="text-xs text-white/60">{formatTime(message.createdAt)}</span>
      </div>
      {message.content && (
        <p className="mt-2 whitespace-pre-wrap text-sm text-white/90">{message.content}</p>
      )}
      {message.imageUrl && (
        <div className="mt-3 overflow-hidden rounded-lg border border-white/10">
          <img
            src={message.imageUrl}
            alt="message attachment"
            className="max-h-64 w-full object-cover"
          />
        </div>
      )}
      {editedLabel && (
        <p className="mt-3 text-xs italic text-white/60">{editedLabel}</p>
      )}
    </div>
  );

  return (
    <div
      className={clsx('flex items-start gap-3', {
        'justify-start': isOwn,
        'justify-end': !isOwn,
      })}
    >
      {isOwn && (
        <Avatar
          src={message.user?.avatarUrl}
          alt={`${message.user?.firstname ?? 'User'} avatar`}
        />
      )}
      {bubble}
      {!isOwn && (
        <Avatar
          src={message.user?.avatarUrl}
          alt={`${message.user?.firstname ?? 'User'} avatar`}
        />
      )}
    </div>
  );
};

const ChatHeader = ({
  isGroup,
  name,
  avatarUrl,
  subtitle,
}: {
  isGroup: boolean;
  name: string;
  avatarUrl?: string | null;
  subtitle?: string | null;
}) => (
  <div className="flex items-center gap-4 border-b border-white/10 bg-white/5 px-8 py-6 backdrop-blur">
    <div className="h-16 w-16 overflow-hidden rounded-full border border-white/20 bg-white/10">
      <img
        src={avatarUrl || DEFAULT_AVATAR}
        alt={name}
        className="h-full w-full object-cover"
      />
    </div>
    <div>
      <h2 className="text-2xl font-semibold text-white">{name}</h2>
      <p className="text-sm text-white/60">
        {isGroup ? 'Group chat' : subtitle ?? 'Direct message'}
      </p>
    </div>
  </div>
);

export default function MessagePage({ params }: PageProps) {
  const { user } = useUserStore();
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ file: File; preview: string } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const emojiWrapperRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const { data, loading, error, refetch } = useQuery<{ messagesBetweenUsers: MessageEdge[] }>(
    GET_MESSAGES,
    {
      variables: {
        otherUserId: params.id,
        limit: 50,
      },
      fetchPolicy: 'network-only',
    },
  );

  const [sendMessage, { loading: sending }] = useMutation(CREATE_MESSAGE, {
    onError: (err) => {
      toast.error(err.message ?? 'Failed to send message');
    },
  });

  const messages = data?.messagesBetweenUsers ?? [];

  const sortedMessages = useMemo(
    () =>
      [...messages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
    [messages],
  );

  const chatroomMeta = useMemo(() => {
    const chatroom = sortedMessages.find((item) => item.chatroom)?.chatroom;
    const isGroup = chatroom?.isGroup ?? false;

    if (!chatroom) {
      return {
        id: null as string | null,
        isGroup: false,
        name: 'Conversation',
        avatarUrl: DEFAULT_AVATAR,
        subtitle: null as string | null,
      };
    }

    if (isGroup) {
      return {
        id: chatroom.id,
        isGroup,
        name: chatroom.name || 'Group chat',
        avatarUrl: chatroom.avatarUrl || DEFAULT_AVATAR,
        subtitle: `${chatroom.memberships?.length ?? 0} participants`,
      };
    }

    const currentUserId = user?.id;
    const otherMember = chatroom.memberships?.find((member) => member.userId !== currentUserId);
    const otherUser = otherMember?.user;

    return {
      id: chatroom.id,
      isGroup,
      name: otherUser?.firstname ?? 'Direct chat',
      avatarUrl: otherUser?.avatarUrl || DEFAULT_AVATAR,
      subtitle: otherUser?.lastname ?? null,
    };
  }, [sortedMessages, user?.id]);

  const trimmedMessage = messageInput.trim();
  const isSending = sending || isUploading;
  const canSend = (trimmedMessage.length > 0 || !!selectedImage) && !isSending;

  useEffect(() => {
    if (!showEmojiPicker) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiWrapperRef.current &&
        !emojiWrapperRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  useEffect(() => {
    if (loading) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }, [sortedMessages, loading]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const maxHeight = 220;
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  }, [messageInput]);

  useEffect(() => {
    return () => {
      if (selectedImage?.preview) {
        URL.revokeObjectURL(selectedImage.preview);
      }
    };
  }, [selectedImage]);

  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setMessageInput((prev) => prev + emoji);
      setShowEmojiPicker(false);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = messageInput.slice(0, start) + emoji + messageInput.slice(end);

    setMessageInput(newValue);
    setShowEmojiPicker(false);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + emoji.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (canSend) {
        void handleSendMessage();
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }

    const maxSizeMb = 10;
    if (file.size > maxSizeMb * 1024 * 1024) {
      toast.error(`Image must be smaller than ${maxSizeMb}MB`);
      return;
    }

    const preview = URL.createObjectURL(file);
    setSelectedImage((current) => {
      if (current?.preview) {
        URL.revokeObjectURL(current.preview);
      }
      return { file, preview };
    });
    setUploadProgress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearSelectedImage = () => {
    setSelectedImage((current) => {
      if (current?.preview) {
        URL.revokeObjectURL(current.preview);
      }
      return null;
    });
    setUploadProgress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async () => {
    const messageText = trimmedMessage;
    const imageToUpload = selectedImage;

    if (!messageText && !imageToUpload) {
      return;
    }

    let imageUrl: string | null = null;

    try {
      if (imageToUpload) {
        setIsUploading(true);
        const { success, url, error: uploadError } = await uploadImageToCloudinary(
          imageToUpload.file,
          (progress) => setUploadProgress(progress),
        );

        if (!success || !url) {
          throw new Error(uploadError ?? 'Failed to upload image');
        }

        imageUrl = url;
      }

      const chatroomIdVariable = chatroomMeta.isGroup
        ? chatroomMeta.id ?? params.id
        : chatroomMeta.id ?? null;

      await sendMessage({
        variables: {
          chatroomId: chatroomIdVariable,
          otherUserId: chatroomMeta.isGroup ? null : params.id,
          content: messageText.length > 0 ? messageText : null,
          imageUrl,
        },
      });

      setMessageInput('');
      clearSelectedImage();
      setShowEmojiPicker(false);
      setUploadProgress(null);
      await refetch();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Sign in to view your messages.
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-screen flex-col bg-gradient-to-br from-zinc-950 via-black to-zinc-900 px-4 py-6 sm:px-8">
      <div className="flex h-[calc(100vh-3rem)] w-full flex-1 flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/70 text-white shadow-2xl backdrop-blur">
        {loading ? <ChatHeaderSkeleton /> : <ChatHeader {...chatroomMeta} />}
        <div className="flex flex-1 flex-col">
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto px-6 py-8 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10"
          >
            {loading && <MessagesSkeleton />}
            {!loading && error && (
              <div className="flex h-full items-center justify-center text-center text-sm text-red-400">
                Failed to load messages. Please try again later.
              </div>
            )}
            {!loading && !error && sortedMessages.length === 0 && <EmptyState />}
            {!loading && !error && sortedMessages.length > 0 && (
              <div className="flex flex-col gap-6">
                {sortedMessages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={message.user?.id === user.id}
                  />
                ))}
              </div>
            )}
            <div className="h-4" />
          </div>
          <div className="border-t border-white/10 bg-black/40 px-4 py-4 sm:px-6">
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
                  <div className="text-sm text-white/70">
                    {isUploading && uploadProgress !== null
                      ? `Uploading… ${uploadProgress}%`
                      : 'Ready to send'}
                  </div>
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
            <div className="flex items-end gap-3">
              <div className="relative flex-1">
                <Textarea
                  ref={textareaRef}
                  value={messageInput}
                  onChange={(event) => setMessageInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Write a message…"
                  rows={1}
                  className="min-h-0 resize-none bg-white/5 text-sm text-white placeholder:text-white/40"
                />
                <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-white/70 hover:text-white"
                    onClick={() => fileInputRef.current?.click()}
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
                      className="text-white/70 hover:text-white"
                      onClick={() => setShowEmojiPicker((prev) => !prev)}
                      aria-label="Add emoji"
                      aria-expanded={showEmojiPicker}
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                    {showEmojiPicker && (
                      <div
                        className="absolute bottom-full right-0 z-50 mb-3 w-72 rounded-2xl border border-white/10 bg-zinc-900/95 p-3 shadow-2xl backdrop-blur"
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
                            <EmojiPicker.List hideStickyHeader containerHeight={240} />
                          </EmojiPicker.Group>
                        </EmojiPicker>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Button
                type="button"
                onClick={() => void handleSendMessage()}
                disabled={!canSend}
                size="icon"
                className="h-12 w-12 rounded-full bg-emerald-500/80 text-white hover:bg-emerald-400/90 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Send message"
              >
                {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
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
              <p className="mt-2 text-xs text-white/60">Uploading image… {uploadProgress}%</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}