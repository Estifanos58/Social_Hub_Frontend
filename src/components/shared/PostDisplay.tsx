"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Comment } from "./Comment";
import { Post } from "@/lib/types";
import {
  FaRegCommentDots,
  FaThumbsUp,
  FaLaughSquint,
  FaSadTear,
  FaSurprise,
  FaHeart,
} from "react-icons/fa";
import { MdOutlineAddReaction } from "react-icons/md";
import React, { useState, useRef, useEffect } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { CommentSection } from "../custom/CommentSection";
import { ADD_REACTION_MUTATION } from "@/graphql/mutations/post/AddReaction";
import { REMOVE_REACTION_MUTATION } from "@/graphql/mutations/post/RemoveReaction";
import { formatRelative } from "@/lib/utils";

export const PostDisplay = ({ post }: { post: Post }) => {
  // Utility: format ISO timestamp into compact relative time (e.g., 5d, 2w, 1min, 30s)
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  const ReactionList = [
    { name: "Like", type: "LIKE", icon: <FaThumbsUp />, color: "text-blue-500" },
    { name: "Love", type: "LOVE", icon: <FaHeart />, color: "text-red-500" },
    {
      name: "Haha",
      type: "HAHA",
      icon: <FaLaughSquint />,
      color: "text-yellow-400",
    },
    { name: "Wow", type: "WOW", icon: <FaSurprise />, color: "text-orange-400" },
    { name: "Sad", type: "SAD", icon: <FaSadTear />, color: "text-purple-500" },
  ];

  // State
  const [showReactions, setShowReactions] = useState(false);
  interface ReactionOption {
    name: string;
    type: string;
  icon: React.ReactNode;
    color: string;
  }

  const [selectedReaction, setSelectedReaction] = useState<ReactionOption | null>(null);
  const [localReactionCount, setLocalReactionCount] = useState<number>(post.reactionsCount || 0);
  const [isPersisting, setIsPersisting] = useState(false);

  // Refs to track backend state
  // Tracks the reaction that the server currently has (last successful state)
  const lastCommittedReactionRef = useRef<ReactionOption | null>(null);
  // Tracks a UI change that hasn't been persisted yet
  const pendingReactionRef = useRef<ReactionOption | null>(null);
  const debounceTimerRef = useRef<any>(null);
  const hideTimerRef = useRef<any>(null);
  // Keeps an authoritative count that mirrors server after each commit
  const originalCountRef = useRef<number>(post.reactionsCount || 0);


  const [addReaction] = useMutation(ADD_REACTION_MUTATION);
  const [removeReaction] = useMutation(REMOVE_REACTION_MUTATION);

  const rollback = () => {
    // Revert UI to last committed state and count
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
    const uiReaction = pendingReactionRef.current;
    const serverReaction = lastCommittedReactionRef.current;
    try {
      setIsPersisting(true);
      if (!serverReaction && uiReaction) {
        // Add new
        await addReaction({ variables: { postId: post.id, type: uiReaction.type } });
        commitState(uiReaction);
        originalCountRef.current += 1; // server now includes this reaction
        return;
      }
      if (serverReaction && !uiReaction) {
        // Remove existing
        await removeReaction({ variables: { postId: post.id } });
        commitState(null);
        originalCountRef.current = Math.max(0, originalCountRef.current - 1);
        return;
      }
      if (serverReaction && uiReaction && serverReaction.type !== uiReaction.type) {
        // Switch type (count unchanged)
        await removeReaction({ variables: { postId: post.id } });
        await addReaction({ variables: { postId: post.id, type: uiReaction.type } });
        commitState(uiReaction);
        return;
      }
    } catch (e) {
      rollback();
    }
    finally {
      setIsPersisting(false);
      // Sync displayed count with authoritative count (covers rollback or rapid toggles)
      setLocalReactionCount(originalCountRef.current);
      setSelectedReaction(lastCommittedReactionRef.current);
    }
  };
  // Initialize selected reaction from server (userReaction) exactly once per post.id
  useEffect(() => {
    if (post.userReaction) {
      const found = ReactionList.find(r => r.type === post.userReaction) || null;
      if (found) {
        setSelectedReaction(found);
        lastCommittedReactionRef.current = found;
      } else {
        lastCommittedReactionRef.current = null;
      }
    } else {
      lastCommittedReactionRef.current = null;
    }
    // Ensure authoritative count is aligned with server value
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
    hideTimerRef.current = setTimeout(() => {
      setShowReactions(false);
    }, 180);
  };

  return (
    <div className="m-6 w-[550px] bg-gray-800 rounded-xl p-4 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img
            src={post.createdBy.avatarUrl}
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold text-sm">{post.createdBy.firstname}</p>
          </div>
        </div>
        <span
          className="text-xs text-gray-500"
          title={post.updatedAt ? `Edited at ${post.updatedAt}` : post.createdAt}
        >
          {post.updatedAt
            ? `Edited ${formatRelative(post.updatedAt)}`
            : formatRelative(post.createdAt)}
        </span>
      </div>

      {/* Content */}
      <p className="mb-3 text-sm">{post.content}</p>

      {/* Images */}
      {post.images.length > 0 && (
        <div className="mb-3">
          <Slider {...sliderSettings}>
            {post.images.map((img: any) => (
              <div key={img.id} className="px-1">
                <img
                  src={img.url}
                  alt="post"
                  className="w-full h-[350px] object-cover rounded-lg"
                />
              </div>
            ))}
          </Slider>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center space-x-6 text-gray-400 text-sm mb-3 relative">
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
            disabled={isPersisting}
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
              {ReactionList.map((reaction) => {
                const isSelected = selectedReaction?.type === reaction.type;
                return (
                  <button
                    key={reaction.name}
                    className={`text-2xl p-2 rounded-full transition-transform duration-150 ${reaction.color} ${
                      isSelected ? "ring-2 ring-white scale-110" : "hover:bg-gray-600 hover:scale-110"
                    }`}
                    onClick={() => {
                      if (isPersisting) return;
                      setSelectedReaction((prev) => {
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
        <button className="hover:text-green-400 flex items-center gap-2 text-2xl">
          <FaRegCommentDots /> {post.commentsCount}
        </button>

      </div>
        <div>
          <CommentSection postId={post.id} />
        </div>
    </div>
  );
};
