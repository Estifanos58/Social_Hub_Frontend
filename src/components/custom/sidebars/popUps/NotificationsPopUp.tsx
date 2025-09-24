"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { useQuery } from '@apollo/client/react';
import { GET_NOTIFICATIONS } from '@/graphql/queries/notification/getNotifications';

interface NotificationsPopUpProps {
  setShowPopup: (value: boolean) => void;
  setIsCollapsed: (value: boolean) => void;
}

type NotificationItem = {
  id: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  actor?: { id: string; firstname: string; lastname?: string; avatarUrl?: string } | null;
  recipient?: { id: string; firstname: string; lastname?: string; avatarUrl?: string } | null;
  post?: { id: string; content: string; images?: { id: string; url: string }[] } | null;
  comment?: { id: string; content: string } | null;
  reaction?: { id: string; type: string } | null;
};

function formatTitle(n: NotificationItem) {
  const actorName = [n.actor?.firstname, n.actor?.lastname].filter(Boolean).join(' ');
  switch (n.type) {
    case 'COMMENT_ON_POST':
      return `${actorName} commented on your post`;
    case 'REPLY_ON_COMMENT':
      return `${actorName} replied to your comment`;
    case 'REACTION_ON_POST':
      return `${actorName} reacted to your post`;
    case 'NEW_FOLLOWER':
      return `${actorName} started following you`;
    case 'POST_DELETED':
      return `Your post was deleted`;
    case 'LOGIN':
      return `New login to your account`;
    default:
      return `Notification`;
  }
}

function NotificationsPopUp({ setShowPopup, setIsCollapsed }: NotificationsPopUpProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, loading, fetchMore } = useQuery<{ notifications: NotificationItem[] }>(GET_NOTIFICATIONS, {
    variables: { take: 10 },
    notifyOnNetworkStatusChange: true,
  });

  const list = data?.notifications ?? [];
  const lastCursor = list.length > 0 ? list[list.length - 1].id : undefined;

  const handleScroll = () => {
    if (!scrollRef.current || loading) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      if (lastCursor) {
        fetchMore({
          variables: { take: 10, cursor: lastCursor },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            return {
              notifications: [...prev.notifications, ...fetchMoreResult.notifications],
            };
          },
        });
      }
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Notifications</h2>
        <button
          onClick={() => { setShowPopup(false); setIsCollapsed(false); }}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto space-y-3">
        {/* Loading skeleton */}
        {loading && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
            <div className="w-10 h-10 bg-gray-700 rounded-full" />
            <div className="flex-1">
              <div className="w-48 h-3 bg-gray-700 rounded mb-2" />
              <div className="w-32 h-3 bg-gray-700 rounded" />
            </div>
          </div>
        ))}

        {/* Items */}

        {!loading && list.map((n) => (
          <div key={n.id} className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition-colors">
            <Image
              src={n.actor?.avatarUrl || '/noAvatar.png'}
              alt={n.actor?.firstname || 'actor'}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="text-white text-sm">{formatTitle(n)}</p>
              <div className="text-gray-400 text-xs mt-0.5 truncate">
                {n.post?.content || n.comment?.content || ''}
              </div>
              <div className="text-gray-500 text-[10px] mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </div>
            {!n.isRead && <span className="w-2 h-2 rounded-full bg-blue-400" />}
          </div>
        ))}

        {!loading && list.length === 0 && (
          <div className="text-center py-8 text-gray-400">No notifications yet.</div>
        )}
      </div>
    </div>
  );
}

export default NotificationsPopUp;