"use client";

import { useMemo, useRef } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_MESSAGES } from "@/graphql/queries/message/getMessages";
import Searching, { MessageSkeletonList } from "./Searching";
import Link from "next/link";


interface MessagePopUpProps {
  setShowPopup: (value: boolean) => void;
  setIsCollapsed: (value: boolean) => void;
}

function MessagePopUp({ setShowPopup, setIsCollapsed }: MessagePopUpProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, loading, error } = useQuery<any>(GET_MESSAGES, {
    fetchPolicy: "cache-and-network",
  });

  const messages = useMemo(() => data?.getMessages ?? [], [data?.getMessages]);
  const hasMessages = messages.length > 0;

  const renderMessages = () => {
    if (loading) {
      return <MessageSkeletonList count={5} />;
    }
    if (!hasMessages) {
      return <div className="text-gray-500">No messages found.</div>;
    }
    return messages.map((message: any) => (
      <div key={message.id} className="p-3 hover:bg-gray-800 rounded-lg">
        {message.content}
      </div>
    ));
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
            {renderMessages()}
            {!loading && !hasMessages && (
              <div className="text-center py-8">
                <p className="text-gray-400">Search a User to start messaging.</p>
              </div>
            )}
          </>
        }
      />
    </div>
  );
}

export default MessagePopUp;