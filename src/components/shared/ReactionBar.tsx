"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  FaThumbsUp,
  FaLaughSquint,
  FaSadTear,
  FaSurprise,
  FaHeart,
  FaRegCommentDots,
} from "react-icons/fa";
import { MdOutlineAddReaction } from "react-icons/md";
import { useMutation } from "@apollo/client/react";
import { ADD_REACTION_MUTATION } from "@/graphql/mutations/post/AddReaction";
import { REMOVE_REACTION_MUTATION } from "@/graphql/mutations/post/RemoveReaction";

interface ReactionBarProps {
  post: {
    id: string;
    reactionsCount?: number | null;
    userReaction?: string | null;
    commentsCount?: number | null;
  };
  onCommentClick?: () => void;
  showCommentButton?: boolean; // default true
  disabled?: boolean;
  className?: string;
}

interface ReactionOption {
  name: string;
  type: string;
  icon: React.ReactNode;
  color: string;
}

/**
 * Unified reaction bar with optimistic update & debounce persistence.
 * Reused in feed cards (PostDisplay) and modal (PostDetailModal).
 */
export const ReactionBar: React.FC<ReactionBarProps> = ({
  post,
  onCommentClick,
  showCommentButton = true,
  disabled = false,
  className = "",
}) => {
  const ReactionList: ReactionOption[] = [
    { name: "Like", type: "LIKE", icon: <FaThumbsUp />, color: "text-blue-500" },
    { name: "Love", type: "LOVE", icon: <FaHeart />, color: "text-red-500" },
    { name: "Haha", type: "HAHA", icon: <FaLaughSquint />, color: "text-yellow-400" },
    { name: "Wow", type: "WOW", icon: <FaSurprise />, color: "text-orange-400" },
    { name: "Sad", type: "SAD", icon: <FaSadTear />, color: "text-purple-500" },
  ];

  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<ReactionOption | null>(null);
  const [localReactionCount, setLocalReactionCount] = useState<number>(post.reactionsCount || 0);
  const [isPersisting, setIsPersisting] = useState(false);

  const lastCommittedReactionRef = useRef<ReactionOption | null>(null);
  const pendingReactionRef = useRef<ReactionOption | null>(null);
  const debounceTimerRef = useRef<any>(null);
  const hideTimerRef = useRef<any>(null);
  const originalCountRef = useRef<number>(post.reactionsCount || 0);

  const [addReaction] = useMutation(ADD_REACTION_MUTATION);
  const [removeReaction] = useMutation(REMOVE_REACTION_MUTATION);

  const rollback = () => {
    const committed = lastCommittedReactionRef.current;
    setSelectedReaction(committed);
    setLocalReactionCount(originalCountRef.current);
  };

  const commitState = (newReaction: ReactionOption | null) => {
    lastCommittedReactionRef.current = newReaction;
  };

  const persistReactionChange = async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    if (disabled) return;
    const uiReaction = pendingReactionRef.current;
    const serverReaction = lastCommittedReactionRef.current;
    try {
      setIsPersisting(true);
      if (!serverReaction && uiReaction) {
        await addReaction({ variables: { postId: post.id, type: uiReaction.type } });
        commitState(uiReaction);
        originalCountRef.current += 1;
        return;
      }
      if (serverReaction && !uiReaction) {
        await removeReaction({ variables: { postId: post.id } });
        commitState(null);
        originalCountRef.current = Math.max(0, originalCountRef.current - 1);
        return;
      }
      if (serverReaction && uiReaction && serverReaction.type !== uiReaction.type) {
        await removeReaction({ variables: { postId: post.id } });
        await addReaction({ variables: { postId: post.id, type: uiReaction.type } });
        commitState(uiReaction);
        return;
      }
    } catch (e) {
      rollback();
    } finally {
      setIsPersisting(false);
      setLocalReactionCount(originalCountRef.current);
      setSelectedReaction(lastCommittedReactionRef.current);
    }
  };

  // Initialize from server values when post changes
  useEffect(() => {
    if (post.userReaction) {
      const found = ReactionList.find(r => r.type === post.userReaction) || null;
      setSelectedReaction(found || null);
      lastCommittedReactionRef.current = found || null;
    } else {
      setSelectedReaction(null);
      lastCommittedReactionRef.current = null;
    }
    originalCountRef.current = post.reactionsCount || 0;
    setLocalReactionCount(post.reactionsCount || 0);
  }, [post.id, post.userReaction, post.reactionsCount]);

  const schedulePersist = () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      persistReactionChange();
    }, 2000);
  };

  const openReactions = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setShowReactions(true);
  };
  const scheduleCloseReactions = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setShowReactions(false), 180);
  };

  return (
    <div className={`flex items-center space-x-6 text-gray-400 text-sm relative ${className}`}>
      <div
        className="relative"
        onMouseEnter={openReactions}
        onMouseLeave={scheduleCloseReactions}
      >
        <button
          className={
            `flex items-center gap-2 text-2xl focus:outline-none transition-colors duration-150 ` +
            (selectedReaction ? selectedReaction.color : "hover:text-blue-400") +
            (isPersisting ? " opacity-70 cursor-wait" : "")
          }
          aria-label={selectedReaction ? `${selectedReaction.name} reaction` : "Add reaction"}
          disabled={isPersisting || disabled}
          type="button"
        >
          <span className={`inline-flex items-center justify-center ${isPersisting ? "animate-pulse" : ""}`}>
            {selectedReaction ? selectedReaction.icon : <MdOutlineAddReaction />}
          </span>
          <span>{localReactionCount}</span>
        </button>
        {showReactions && (
          <div
            className="absolute z-10 bottom-full left-0 mb-2 flex bg-gray-700 rounded-lg shadow-lg p-2 space-x-2"
            onMouseEnter={openReactions}
            onMouseLeave={scheduleCloseReactions}
          >
            {ReactionList.map(reaction => {
              const isSelected = selectedReaction?.type === reaction.type;
              return (
                <button
                  key={reaction.name}
                  className={`text-2xl p-2 rounded-full transition-transform duration-150 ${reaction.color} ` +
                    (isSelected ? "ring-2 ring-white scale-110" : "hover:bg-gray-600 hover:scale-110")}
                  onClick={() => {
                    if (isPersisting || disabled) return;
                    setSelectedReaction(prev => {
                      if (prev && prev.type === reaction.type) {
                        setLocalReactionCount(c => Math.max(0, c - 1));
                        pendingReactionRef.current = null;
                        schedulePersist();
                        scheduleCloseReactions();
                        return null;
                      }
                      if (!prev) {
                        setLocalReactionCount(c => c + 1);
                        pendingReactionRef.current = reaction;
                        schedulePersist();
                        scheduleCloseReactions();
                        return reaction;
                      }
                      pendingReactionRef.current = reaction;
                      schedulePersist();
                      scheduleCloseReactions();
                      return reaction;
                    });
                  }}
                  type="button"
                  aria-label={reaction.name}
                  title={reaction.name}
                >
                  {reaction.icon}
                </button>
              );
            })}
          </div>
        )}
      </div>
      {showCommentButton && (
        <button
          onClick={onCommentClick}
          className="hover:text-green-400 flex items-center gap-2 text-2xl"
          aria-label="Open comments"
          disabled={disabled}
          type="button"
        >
          <FaRegCommentDots /> {post.commentsCount ?? 0}
        </button>
      )}
    </div>
  );
};
