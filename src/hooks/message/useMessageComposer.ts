import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, KeyboardEvent, RefObject } from 'react';
import type { MessageEdge } from '@/lib/types';
import { useCloudinaryImageUpload } from '@/hooks/useCloudinaryImageUpload';
import { toast } from 'sonner';
import { userMessageStore } from '@/store/messageStore';
import { buildChatroomListItemFromMessageEdge } from './chatroomList.helpers';

interface CreateMessageVariables {
  chatroomId?: string | null;
  otherUserId?: string | null;
  content?: string | null;
  imageUrl?: string | null;
}

type SendMessageFunction = (options?: { variables?: CreateMessageVariables }) => Promise<any>;

interface UseMessageComposerOptions {
  chatroomId: string | null;
  otherUserId: string;
  currentUserId?: string | null;
  isSending: boolean;
  sendMessage: SendMessageFunction;
  onMessageSent: (message: MessageEdge) => void;
  onError?: (message: string) => void;
}

interface UseMessageComposerResult {
  messageInput: string;
  handleInputChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  handleSendMessage: () => Promise<void>;
  handleEmojiSelect: (emoji: unknown) => void;
  toggleEmojiPicker: () => void;
  closeEmojiPicker: () => void;
  showEmojiPicker: boolean;
  canSend: boolean;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  emojiWrapperRef: RefObject<HTMLDivElement | null>;
  selectedImage: { file: File; preview: string } | null;
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  clearSelectedImage: () => void;
  uploadProgress: number | null;
  isUploading: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  openFilePicker: () => void;
}

export const useMessageComposer = ({
  chatroomId,
  otherUserId,
  currentUserId,
  isSending,
  sendMessage,
  onMessageSent,
  onError,
}: UseMessageComposerOptions): UseMessageComposerResult => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const emojiWrapperRef = useRef<HTMLDivElement | null>(null);

  const {
    selectedImage,
    handleFileChange,
    clearSelectedImage,
    uploadSelectedImage,
    progress,
    isUploading,
    fileInputRef,
    openFilePicker,
  } = useCloudinaryImageUpload();

  // Cache the selector to avoid infinite loop
  const upsertChatroom = userMessageStore(
    useMemo(() => (state) => state.upsertChatroom, [])
  );

  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const notifyError = useCallback(
    (message: string) => {
      if (onError) {
        onError(message);
      } else {
        toast.error(message);
      }
    },
    [onError],
  );

  const trimmedMessage = useMemo(() => messageInput.trim(), [messageInput]);
  const canSend = useMemo(
    () => (trimmedMessage.length > 0 || !!selectedImage) && !isSending && !isUploading,
    [isSending, isUploading, selectedImage, trimmedMessage],
  );

  const resetInputState = useCallback(() => {
    setMessageInput('');
    clearSelectedImage();
    setShowEmojiPicker(false);
  }, [clearSelectedImage]);

  const handleSendMessage = useCallback(async () => {
    if (!trimmedMessage && !selectedImage) {
      return;
    }

    let imageUrl: string | null = null;

    try {
      if (selectedImage) {
        imageUrl = await uploadSelectedImage();
        if (!imageUrl) {
          throw new Error('Failed to upload image');
        }
      }

      const response = await sendMessage({
        variables: {
          chatroomId: chatroomId ?? null,
          otherUserId: chatroomId ? null : otherUserId,
          content: trimmedMessage.length > 0 ? trimmedMessage : null,
          imageUrl,
        },
      });

      const newMessage = response.data?.createMessageMutation as MessageEdge | undefined;
      if (newMessage) {
        onMessageSent(newMessage);

        if (currentUserId) {
          const listItem = buildChatroomListItemFromMessageEdge(newMessage, currentUserId);
          if (listItem) {
            const exists = userMessageStore
              .getState()
              .chatrooms.some((room) => room.id === listItem.id);

            if (!exists) {
              upsertChatroom(listItem);
            }
          }
        }
      }

      resetInputState();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send message';
      notifyError(message);
    }
  }, [
    chatroomId,
    notifyError,
    onMessageSent,
    otherUserId,
    currentUserId,
    resetInputState,
    selectedImage,
    sendMessage,
    trimmedMessage,
    uploadSelectedImage,
    upsertChatroom,
  ]);

  const handleEmojiSelect = useCallback(
    (emoji: unknown) => {
      const value = (() => {
        if (typeof emoji === 'string') return emoji;
        if (emoji && typeof emoji === 'object') {
          const maybeEmoji = emoji as { native?: string; emoji?: string };
          if (typeof maybeEmoji.native === 'string') return maybeEmoji.native;
          if (typeof maybeEmoji.emoji === 'string') return maybeEmoji.emoji;
        }
        return '';
      })();

      if (!value) {
        setShowEmojiPicker(false);
        return;
      }

      const textarea = textareaRef.current;
      if (!textarea) {
        setMessageInput((prev) => prev + value);
        setShowEmojiPicker(false);
        return;
      }

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = messageInput.slice(0, start) + value + messageInput.slice(end);

      setMessageInput(newValue);
      setShowEmojiPicker(false);

      requestAnimationFrame(() => {
        textarea.focus();
        const cursor = start + value.length;
        textarea.setSelectionRange(cursor, cursor);
      });
    },
    [messageInput],
  );

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setMessageInput(event.target.value);
    },
    [],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (canSend) {
          void handleSendMessage();
        }
      }
    },
    [canSend, handleSendMessage],
  );

  const toggleEmojiPicker = useCallback(() => {
    setShowEmojiPicker((prev) => !prev);
  }, []);

  const closeEmojiPicker = useCallback(() => {
    setShowEmojiPicker(false);
  }, []);

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
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const maxHeight = 220;
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  }, [messageInput]);

  return {
    messageInput,
    handleInputChange,
    handleKeyDown,
    handleSendMessage,
    handleEmojiSelect,
    toggleEmojiPicker,
    closeEmojiPicker,
    showEmojiPicker,
    canSend,
    textareaRef,
    emojiWrapperRef,
    selectedImage,
    handleFileChange,
    clearSelectedImage,
    uploadProgress: progress,
    isUploading,
    fileInputRef,
    openFilePicker,
  };
};
