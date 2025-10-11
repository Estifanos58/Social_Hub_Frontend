'use client';

import { useMemo, useState } from "react";
import type { ChangeEvent, ReactNode, Ref } from "react";
import { IoSearchOutline } from "react-icons/io5";
import Image from "next/image";
import { useQuery } from "@apollo/client/react";
import { SEARCH_USERS } from "@/graphql/queries/user/searchUsers";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { userMessageStore } from "@/store/messageStore";
import { DEFAULT_AVATAR } from "@/lib/types";

interface SearchingProps {
  defaultContent: ReactNode;
  scrollRef?: Ref<HTMLDivElement>;
  placeholder?: string;
  limit?: number;
}

interface SearchUsersQueryData {
  SearchUsers: {
    hasMore: boolean;
    users: Array<{
      id: string;
      firstname: string;
      lastname: string | null;
      email: string;
      avatarUrl: string | null;
    }>;
  };
}

interface SearchUsersQueryVariables {
  searchUsersInput: {
    searchTerm: string;
    limit?: number;
    offset?: number;
  };
}

export function MessageSkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 rounded-lg bg-gray-900/40 animate-pulse"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-700" />
            <div className="space-y-2">
              <div className="w-28 h-3 rounded bg-gray-700" />
              <div className="w-20 h-3 rounded bg-gray-800" />
            </div>
          </div>
          <div className="w-16 h-6 rounded-full bg-gray-800" />
        </div>
      ))}
    </div>
  );
}

function Searching({
  defaultContent,
  scrollRef,
  placeholder = "Search people",
  limit = 10,
}: SearchingProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const router = useRouter()
  const setSelectedChatRoomId = userMessageStore((state) => state.setSelectedChatRoomId);
  const setSelectedChatroomMeta = userMessageStore((state) => state.setSelectedChatroomMeta);

  const shouldSkip = useMemo(() => debouncedSearchTerm.trim().length === 0, [
    debouncedSearchTerm,
  ]);

  const { data, loading, error } = useQuery<
    SearchUsersQueryData,
    SearchUsersQueryVariables
  >(SEARCH_USERS, {
    variables: {
      searchUsersInput: {
        searchTerm: debouncedSearchTerm.trim(),
        limit,
        offset: 0,
      },
    },
    skip: shouldSkip,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleMessageRoute = (user: SearchUsersQueryData['SearchUsers']['users'][number]) => {
    setSelectedChatRoomId(null);
    setSelectedChatroomMeta({
      id: null,
      isGroup: false,
      name: user.firstname,
      avatarUrl: user.avatarUrl ?? DEFAULT_AVATAR,
      subtitle: user.email,
    });
    router.replace(`/message/${user.id}`)
  }

  const users = data?.SearchUsers?.users ?? [];
  const isSearching = !shouldSkip;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="relative mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 pl-4 focus:outline-none focus:ring-2 focus:ring-gray-600"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <IoSearchOutline className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {isSearching ? (
        <div className="flex-1 overflow-y-auto space-y-3">
          {loading && <MessageSkeletonList count={5} />}

          {error && !loading && (
            <div className="text-red-400 text-center py-6">
              Failed to search users. Please try again.
            </div>
          )}

          {!loading && !error && users.length === 0 && (
            <div className="text-gray-400 text-center py-8">
              No users match your search.
            </div>
          )}

          {!loading && !error && users.length > 0 && (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                 onClick={() => handleMessageRoute(user)}
                  key={user.id}
                  className="flex pointer items-center justify-between p-3 rounded-lg bg-gray-900/40 hover:bg-gray-900 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Image
                      src={user.avatarUrl || "/noAvatar.png"}
                      alt={user.firstname}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-white font-medium">
                        {user.firstname} {user.lastname ?? ""}
                      </p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    View
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-3"
        >
          {defaultContent}
        </div>
      )}
    </div>
  );
}

export default Searching;
