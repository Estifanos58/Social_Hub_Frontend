'use client'

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Comment } from "./Comment";
import { Post } from "@/lib/types";
import { FaRegCommentDots, FaThumbsUp, FaLaughSquint, FaSadTear, FaSurprise, FaHeart } from "react-icons/fa";
import { MdOutlineAddReaction } from "react-icons/md";
import { useState, useRef } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";



export const PostDisplay = ({ post }: { post: Post }) => {
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };


  const ReactionList = [
    {
      name: "Like",
      type: "LIKE",
      icon: <FaThumbsUp />,
      color: "text-blue-500",
    },
    {
      name: "Love",
      type: "LOVE",
      icon: <FaHeart />,
      color: "text-red-500",
    },
    {
      name: "Haha",
      type: "HAHA",
      icon: <FaLaughSquint />,
      color: "text-yellow-400",
    },
    {
      name: "Wow",
      type: "WOW",
      icon: <FaSurprise />,
      color: "text-orange-400",
    },
    {
      name: "Sad",
      type: "SAD",
      icon: <FaSadTear />,
      color: "text-purple-500",
    }
  ];

  // State for selected reaction and popup
  const [showReactions, setShowReactions] = useState<any>(false);
  const [selectedReaction, setSelectedReaction] = useState<any>(null);
  // We derive the displayed count instead of mutating state to avoid double increments.
  const previousReactionRef = useRef<any>(null);
  const pendingReactionRef = useRef<any>(null); // latest UI chosen reaction (may differ from committed backend state)
  const debounceTimerRef = useRef<any>(null);
  const lastCommittedReactionRef = useRef<any>(null); // track what backend currently has (best guess)

  // GraphQL mutations (adjust names/fields if backend exposes different ones later)
  const ADD_REACTION_MUTATION = gql`
    mutation AddReaction($postId: String!, $type: ReactionType!) {
      addReaction(postId: $postId, type: $type) 
    }
  `;

  const REMOVE_REACTION_MUTATION = gql`
    mutation RemoveReaction($postId: String!, $type: ReactionType!) {
      removeReaction(postId: $postId, type: $type) 
    }
  `;

  const [addReaction] = useMutation(ADD_REACTION_MUTATION);
  const [removeReaction] = useMutation(REMOVE_REACTION_MUTATION);

  const rollback = () => {
    // Roll back to last committed backend state
    setSelectedReaction(lastCommittedReactionRef.current);
  };

  const commitState = (newReaction: any) => {
    previousReactionRef.current = newReaction;
    lastCommittedReactionRef.current = newReaction;
  };

  const persistReactionChange = async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    const uiReaction = pendingReactionRef.current; // current UI selection
    const serverReaction = lastCommittedReactionRef.current; // last known committed
    try {
      // Cases:
      // 1. serverReaction null, uiReaction non-null => add
      if (!serverReaction && uiReaction) {
        await addReaction({ variables: { postId: post.id, type: uiReaction.type } });
        commitState(uiReaction);
        return;
      }
      // 2. serverReaction non-null, uiReaction null => remove
      if (serverReaction && !uiReaction) {
        await removeReaction({ variables: { postId: post.id, type: serverReaction.type } });
        commitState(null);
        return;
      }
      // 3. both non-null, types differ => switch (remove old, add new) - could be optimized server-side
      if (serverReaction && uiReaction && serverReaction.type !== uiReaction.type) {
        await removeReaction({ variables: { postId: post.id, type: serverReaction.type } });
        await addReaction({ variables: { postId: post.id, type: uiReaction.type } });
        commitState(uiReaction);
        return;
      }
      // 4. both null or same => nothing to do
    } catch (e) {
      rollback();
    }
  };

  const schedulePersist = () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      persistReactionChange();
    }, 2000); // 2s idle window
  };
  const hideTimerRef = useRef<any>(null);

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
    }, 180); // small delay prevents flicker moving between button and popup
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
            {/* <p className="text-gray-400 text-xs">@{post.user.username}</p> */}
          </div>
        </div>
        <span className="text-xs text-gray-500">{post.updatedAt ? `Edited ${post.updatedAt}` : post.createdAt}</span>
      </div>

      {/* Content */}
      <p className="mb-3 text-sm">{post.content}</p>

      {/* Images as carousel */}
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
      <div className="flex items-center space-x-6 text-gray-400 text-sm mb-3">
        <div className="relative" onMouseEnter={openReactions} onMouseLeave={scheduleCloseReactions}>
          <button
            className={`flex items-center gap-2 text-2xl focus:outline-none ${selectedReaction ? selectedReaction.color : "hover:text-blue-400"}`}
          >
            {selectedReaction ? selectedReaction.icon : <MdOutlineAddReaction />}
            {(() => {
              // Base from original post count and whether server had a reaction
              const base = post.reactionsCount || 0;
              const serverHad = !!lastCommittedReactionRef.current;
              const uiHas = !!selectedReaction;
              if (serverHad && !uiHas) return base - 1; // removed
              if (!serverHad && uiHas) return base + 1; // newly added
              return base; // unchanged or switching type
            })()}
          </button>
          {showReactions && (
            <div 
              className="absolute z-10 bottom-full left-0 mb-2 flex bg-gray-700 rounded-lg shadow-lg p-2 space-x-2"
              onMouseEnter={openReactions}
              onMouseLeave={scheduleCloseReactions}
            >
              {ReactionList.map((reaction) => (
                <button
                  key={reaction.name}
                  className={`text-2xl p-2 rounded-full transition-colors duration-150 ${reaction.color} ${selectedReaction?.name === reaction.name ? "ring-2 ring-white" : "hover:bg-gray-600"}`}
                  onClick={() => {
                    setSelectedReaction((prev: any) => {
                      // Click same reaction -> remove optimistically
                      if (prev && prev.type === reaction.type) {
                        // count is derived now; no direct mutation
                        pendingReactionRef.current = null;
                        schedulePersist();
                        scheduleCloseReactions();
                        return null;
                      }
                      // First reaction -> increment optimistically
                      if (!prev) {
                        // count is derived now; no direct mutation
                        pendingReactionRef.current = reaction;
                        schedulePersist();
                        scheduleCloseReactions();
                        return reaction;
                      }
                      // Switching reaction -> keep count
                      pendingReactionRef.current = reaction;
                      schedulePersist();
                      scheduleCloseReactions();
                      return reaction;
                    });
                  }}
                  type="button"
                >
                  {reaction.icon}
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="hover:text-green-400 flex items-center gap-2 text-2xl"><FaRegCommentDots/> {post.commentsCount}</button>
      </div>

      {/* Comments */}
      {/* <div className="space-y-3">
        {post.comments.map((comment: any) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div> */}
    </div>
  );
};