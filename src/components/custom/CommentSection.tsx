"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Smile } from "lucide-react";
import { EmojiPicker } from "@ferrucc-io/emoji-picker";
import { useMutation } from "@apollo/client/react";
import { CREATE_COMMENT_MUTATION } from "@/graphql/mutations/comment/CreateComment";
import { toast } from "sonner";
interface CreatedComment {
  id: string;
  content: string;
  postId: string;
  createdAt: string;
  parentId?: string | null;
  createdBy?: {
    id: string;
    firstname?: string;
    lastname?: string;
    avatarUrl?: string;
  };
}

interface CommentSectionProps {
  postId: string;
  parentId?: string; // for replies
  onCreated?: (comment: CreatedComment) => void;
  autoFocus?: boolean;
  placeholder?: string;
  compact?: boolean;
}

export const CommentSection = ({
  postId,
  parentId,
  onCreated,
  autoFocus = false,
  placeholder = "Write a comment...",
  compact = false,
}: CommentSectionProps) => {
  const [comment, setComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  interface CreateCommentResult { createComment: CreatedComment }
  interface CreateCommentVars { postId: string; content: string; parentId?: string | null }
  const [ createComment, { loading } ] = useMutation<CreateCommentResult, CreateCommentVars>(CREATE_COMMENT_MUTATION)

  // Auto-resize textarea helper
  const adjustTextareaHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    // Limit max height to avoid huge expansion
    const max = 220;
    const newHeight = Math.min(el.scrollHeight, max);
    el.style.height = newHeight + "px";
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
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

  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newComment = comment.slice(0, start) + emoji + comment.slice(end);

    setComment(newComment);
    setShowEmojiPicker(false);

    // Focus back to textarea and set cursor position after emoji
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

    const handleSubmit = async () => {
      if (!comment.trim() || isSubmitting) return;
      setIsSubmitting(true);
      try {
        const { data } = await createComment({
          variables: { postId, content: comment.trim(), parentId: parentId || null },
        });
        const created = data?.createComment;
        if (created) onCreated?.(created);
        setComment("");
          toast.success(parentId ? "Reply added" : "Comment posted");
        } catch (error) {
        console.error("Failed to submit comment:", error);
          toast.error("Failed to post comment");
      } finally {
        setIsSubmitting(false);
      }
    };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={
      (compact
        ? "mt-2 rounded-lg border border-gray-800/60 bg-gray-900/70 p-3"
        : "mt-4 rounded-xl border border-gray-800/80 bg-gradient-to-b from-gray-900/80 to-gray-900/40 p-4") +
      " text-gray-200 shadow-inner shadow-black/40 transition-colors"
    }>
      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative group">
            <Textarea
              ref={textareaRef}
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                requestAnimationFrame(adjustTextareaHeight);
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              autoFocus={autoFocus}
              className={(compact ? "min-h-[40px] text-sm" : "min-h-[48px] text-2xl") + " max-h-[140px] leading-relaxed resize-none pr-12 bg-gray-800/70 border border-gray-700/70 hover:border-gray-600 focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/30 placeholder:text-gray-500 rounded-lg shadow-sm focus:shadow-md transition-all duration-200 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-700/70 hover:scrollbar-thumb-gray-600"}
              rows={2}
              style={{ overflowY: "auto" }}
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <div className="relative" ref={emojiPickerRef}>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEmojiPicker((v) => !v)}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-amber-400 hover:bg-gray-700/60 rounded-md transition-colors"
                  aria-label="Add emoji"
                  aria-haspopup="dialog"
                  aria-expanded={showEmojiPicker}
                >
                  <Smile className="h-4 w-4 transition-transform group-focus-within:scale-110" />
                </Button>
                {showEmojiPicker && (
                  <div
                    className="absolute bottom-full right-0 mb-2 z-50 w-80 origin-bottom-right rounded-xl border border-gray-700/70 bg-gray-900/95 shadow-xl ring-1 ring-black/50 backdrop-blur-md p-2 animate-[fadeIn_120ms_ease-out]"
                    data-theme="dark"
                    role="dialog"
                    aria-label="Emoji picker"
                  >
                    <div className="max-h-80 overflow-y-auto pr-1 custom-scrollbar scrollbar-thin scrollbar-thumb-gray-700/70 scrollbar-track-transparent">
                      <EmojiPicker
                        className="border border-gray-700/60 bg-gray-950/60 dark:border-zinc-800 rounded-lg"
                        emojisPerRow={12}
                        emojiSize={28}
                        onEmojiSelect={handleEmojiSelect}
                      >
                        <EmojiPicker.Header className="p-2 pb-0">
                          <EmojiPicker.Input
                            placeholder="Search emoji"
                            autoFocus={true}
                            className="rounded-md bg-gray-800/70 placeholder:text-gray-500 text-sm focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 border border-gray-700/70 w-full px-2 py-1 transition"
                          />
                        </EmojiPicker.Header>
                        <EmojiPicker.Group>
                          <EmojiPicker.List
                            hideStickyHeader={true}
                            containerHeight={400}
                          />
                        </EmojiPicker.Group>
                      </EmojiPicker>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {comment.trim() && (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={(compact ? "bg-gray-800 h-9 px-3 text-xs" : "bg-gray-900 h-full") + " hover:bg-gray-800 text-white shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all"}
            >
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          )}
        </div>
        {comment.trim() && !compact && (
          <div className="text-xs text-gray-500 mt-2 pl-0.5 select-none">
            Press Cmd+Enter (Mac) or Ctrl+Enter (Windows) to post
          </div>
        )}
      </div>
    </div>
  );
};
