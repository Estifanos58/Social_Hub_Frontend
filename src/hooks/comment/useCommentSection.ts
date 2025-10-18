import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";

import { CREATE_COMMENT_MUTATION } from "@/graphql/mutations/comment/CreateComment";
import { useGeneralStore } from "@/store/generalStore";
import { useUserStore } from "@/store/userStore";

export interface CreatedComment {
  id: string;
  content: string;
  postId: string;
  createdAt: string;
  replyCount?: number | null;
  parentId?: string | null;
  createdBy?: {
    id: string;
    firstname?: string;
    lastname?: string;
    avatarUrl?: string;
  };
}

interface CreateCommentResult {
  createComment: CreatedComment;
}

interface CreateCommentVariables {
  postId: string;
  content: string;
  parentId?: string | null;
}

interface UseCommentSectionParams {
  postId: string;
  parentId?: string;
  onCreated?: (comment: CreatedComment) => void;
}

export const useCommentSection = ({
  postId,
  parentId,
  onCreated,
}: UseCommentSectionParams) => {
  const [comment, setComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const { setPostComment, setReplayComment } = useGeneralStore();
  const { user } = useUserStore();

  const [createComment] = useMutation<CreateCommentResult, CreateCommentVariables>(
    CREATE_COMMENT_MUTATION,
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleEmojiSelect = useCallback(
    (emoji: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newComment = comment.slice(0, start) + emoji + comment.slice(end);

      setComment(newComment);
      setShowEmojiPicker(false);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    },
    [comment],
  );

  const handleSubmit = useCallback(async () => {
    if (!comment.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const content = comment.trim();
      const { data } = await createComment({
        variables: { postId, content, parentId: parentId || null },
      });

      const created = data?.createComment;
      if (created) {
        const actor = user
          ? {
              id: user?.id,
              firstname: user?.firstname,
              lastname: user?.lastname,
              avatarUrl: user?.avatarUrl ?? "",
            }
          : {
              id: created.createdBy?.id ?? "",
              firstname: created.createdBy?.firstname ?? "",
              lastname: created.createdBy?.lastname ?? "",
              avatarUrl: created.createdBy?.avatarUrl ?? "",
            };

        if (parentId) {
          setReplayComment(parentId, content, actor);
        } else {
          setPostComment(content, postId, actor);
        }

        onCreated?.(created);
      }

      setComment("");
      toast.success(parentId ? "Reply added" : "Comment posted");
    } catch (error) {
      console.error("Failed to submit comment:", error);
      toast.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  }, [comment, createComment, isSubmitting, onCreated, parentId, postId, setPostComment, setReplayComment, user]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        void handleSubmit();
      }
    },
    [handleSubmit],
  );

  return {
    comment,
    setComment,
    showEmojiPicker,
    setShowEmojiPicker,
    isSubmitting,
    textareaRef,
    emojiPickerRef,
    handleEmojiSelect,
    handleSubmit,
    handleKeyDown,
  };
};
