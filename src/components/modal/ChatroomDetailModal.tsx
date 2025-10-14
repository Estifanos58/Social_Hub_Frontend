"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Loader2, Search, ShieldCheck, UserPlus, X } from "lucide-react";
import { useLazyQuery, useMutation } from "@apollo/client/react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatroomDetail } from "@/hooks/chatroom/useChatroomDetail";
import { useDebounce } from "@/hooks/useDebounce";
import { useUserStore } from "@/store/userStore";
import { DEFAULT_AVATAR, ChatroomDetail, ChatroomMemberDetail } from "@/lib/types";
import type { ChatroomMeta } from "@/lib/types";
import { SEARCH_USERS } from "@/graphql/queries/user/searchUsers";
import { ADD_USERS_TO_CHATROOM } from "@/graphql/mutations/chatroom/addUsersToChatroom";

interface ChatroomDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chatroomId?: string | null;
  otherUserId?: string;
  meta?: ChatroomMeta;
}

type SearchUserResult = {
  id: string;
  firstname?: string | null;
  lastname?: string | null;
  email: string;
  avatarUrl?: string | null;
};

interface SearchUsersQueryData {
  SearchUsers: {
    hasMore: boolean;
    users: SearchUserResult[];
  };
}

interface SearchUsersQueryVariables {
  searchUsersInput: {
    searchTerm: string;
    limit?: number;
    offset?: number;
  };
}

interface AddMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chatroomId?: string | null;
  existingMembers?: ChatroomMemberDetail[] | null;
  onUsersAdded?: () => void | Promise<void>;
}

const FallbackStats = () => (
  <div className="grid gap-4 sm:grid-cols-2">
    {[1, 2, 3].map((key) => (
      <div key={key} className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="h-4 w-24 animate-pulse rounded bg-white/20" />
        <div className="mt-3 h-6 w-32 animate-pulse rounded bg-white/30" />
      </div>
    ))}
  </div>
);

const FallbackMembers = () => (
  <div className="space-y-3">
    {[1, 2, 3].map((key) => (
      <div key={key} className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-full bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-40 animate-pulse rounded bg-white/20" />
          <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
        </div>
      </div>
    ))}
  </div>
);

interface DetailHeaderProps {
  detail: Partial<ChatroomDetail> | null;
  isLoading: boolean;
}

const DetailHeader = ({ detail, isLoading }: DetailHeaderProps) => {
  const name = detail?.name ?? "Chatroom";
  const avatarUrl = detail?.avatarUrl || DEFAULT_AVATAR;

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <Image src={avatarUrl} alt={name} width={64} height={64} className="h-16 w-16 object-cover" />
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-white">{name}</h2>
        <p className="text-sm text-white/60">
          {detail?.isGroup ? "Group chat" : "Direct message"}
          {isLoading && <span className="ml-2 inline-flex items-center text-xs text-emerald-300"><Loader2 className="mr-1 h-3 w-3 animate-spin" />Loading…</span>}
        </p>
      </div>
    </div>
  );
};

export function ChatroomDetailModal({ open, onOpenChange, chatroomId, otherUserId, meta }: ChatroomDetailModalProps) {
  const initialData = meta
    ? {
        id: meta.id ?? chatroomId ?? otherUserId,
        isGroup: meta.isGroup,
        name: meta.name,
        avatarUrl: meta.avatarUrl,
      }
    : null;

  const { detail, loading, isInitialLoading, error, refetch, hasRemoteDetail } = useChatroomDetail({
    chatroomId,
    otherUserId: chatroomId ? undefined : otherUserId,
    enabled: open,
    initialData,
  });

  const effectiveChatroomId = chatroomId ?? detail?.id ?? meta?.id ?? null;
  const isGroupChat = Boolean(detail?.isGroup ?? initialData?.isGroup ?? meta?.isGroup);
  const existingMembers = detail?.members ?? null;
  const [isAddMembersOpen, setAddMembersOpen] = useState(false);

  useEffect(() => {
    if (!open && isAddMembersOpen) {
      setAddMembersOpen(false);
    }
  }, [open, isAddMembersOpen]);

  const handleMembersAdded = useCallback(() => {
    void refetch();
  }, [refetch]);

  const showSkeleton = isInitialLoading;
  const showContent = Boolean(detail && (hasRemoteDetail || !showSkeleton));

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[85vh] w-full max-w-xl overflow-hidden border border-white/10 bg-gray-900 text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle>Chatroom details</DialogTitle>
          <DialogDescription className="text-white/60">
            Review information about this conversation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <DetailHeader detail={detail ?? initialData} isLoading={loading && !showContent} />

          {isGroupChat && (
            <div className="flex justify-end">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setAddMembersOpen(true)}
                disabled={!effectiveChatroomId}
                className="inline-flex items-center gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                <UserPlus className="h-4 w-4" />
                Add members
              </Button>
            </div>
          )}

          {error && !loading && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
              Failed to load chatroom details.
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  void refetch();
                }}
                className="ml-3 bg-white/5 text-white hover:bg-white/10"
              >
                Retry
              </Button>
            </div>
          )}

          {showSkeleton && (
            <div className="space-y-6">
              <FallbackStats />
              <FallbackMembers />
            </div>
          )}

          {showContent && detail && (
            <div className="max-h-[50vh] space-y-6 overflow-y-auto pr-1">
              {detail.isGroup ? (
                <GroupDetailSection detail={detail} isLoading={loading && !hasRemoteDetail} />
              ) : (
                <DirectDetailSection detail={detail} isLoading={loading && !hasRemoteDetail} />
              )}
            </div>
          )}

          {!showContent && !showSkeleton && !error && detail && !hasRemoteDetail && (
            <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
              We&apos;ll display more details once they&apos;re available for this chatroom.
            </p>
          )}
        </div>
        </DialogContent>
      </Dialog>
      <AddMembersDialog
        open={open && isAddMembersOpen}
        onOpenChange={setAddMembersOpen}
        chatroomId={effectiveChatroomId}
        existingMembers={existingMembers}
        onUsersAdded={handleMembersAdded}
      />
    </>
  );
}

const AddMembersDialog = ({
  open,
  onOpenChange,
  chatroomId,
  existingMembers,
  onUsersAdded,
}: AddMembersDialogProps) => {
  const { user } = useUserStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<SearchUserResult[]>([]);
  const debouncedSearch = useDebounce(searchTerm, 400);

  const existingMemberIds = useMemo(
    () => new Set((existingMembers ?? []).map((member) => member.userId)),
    [existingMembers],
  );
  const selectedUserIds = useMemo(
    () => new Set(selectedUsers.map((item) => item.id)),
    [selectedUsers],
  );

  const [runSearch, { data: searchData, loading: searchLoading, error: searchError }] = useLazyQuery<
    SearchUsersQueryData,
    SearchUsersQueryVariables
  >(SEARCH_USERS, {
    fetchPolicy: "network-only",
  });

  const [addUsers, { loading: addLoading, error: addError }] = useMutation<any>(ADD_USERS_TO_CHATROOM);

  useEffect(() => {
    if (!open) {
      setSearchTerm("");
      setSelectedUsers([]);
    }
  }, [open]);

  useEffect(() => {
    const trimmed = debouncedSearch.trim();
    if (!open || trimmed.length === 0) {
      return;
    }

    runSearch({
      variables: {
        searchUsersInput: {
          searchTerm: trimmed,
          limit: 10,
          offset: 0,
        },
      },
    }).catch(() => {
      // handled by Apollo error state
    });
  }, [debouncedSearch, open, runSearch]);

  const searchResults = useMemo(() => {
    const users = searchData?.SearchUsers?.users ?? [];
    return users.filter(
      (candidate) =>
        candidate.id !== user?.id &&
        !existingMemberIds.has(candidate.id) &&
        !selectedUserIds.has(candidate.id),
    );
  }, [existingMemberIds, searchData?.SearchUsers?.users, selectedUserIds, user?.id]);

  const handleSelectUser = useCallback(
    (person: SearchUserResult) => {
      setSelectedUsers((prev) => [...prev, person]);
    },
    [],
  );

  const handleRemoveUser = useCallback((userId: string) => {
    setSelectedUsers((prev) => prev.filter((item) => item.id !== userId));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!chatroomId || !user?.id || selectedUsers.length === 0) {
      return;
    }

    try {
      const ids = selectedUsers.map((item) => item.id);
      const { data } = await addUsers({
        variables: {
          userId: user.id,
          chatroomId,
          otherUserIds: ids,
        },
      });

      if (data?.addUserToChatroomMutation) {
        await Promise.resolve(onUsersAdded?.());
        setSelectedUsers([]);
        setSearchTerm("");
        onOpenChange(false);
      }
    } catch (mutationError) {
      // error handled via Apollo state
    }
  }, [addUsers, chatroomId, onOpenChange, onUsersAdded, selectedUsers, user?.id]);

  const canSubmit = Boolean(chatroomId && user?.id && selectedUsers.length > 0 && !addLoading);
  const trimmedSearch = debouncedSearch.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border border-white/10 bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle>Add members</DialogTitle>
          <DialogDescription className="text-white/60">
            Search for people to add to this chatroom.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-white/50">Search</label>
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Type a name or email"
                className="pl-9 text-sm text-white placeholder:text-white/40"
              />
              {searchLoading && (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-white/60" />
              )}
            </div>
            {searchError && (
              <p className="mt-2 text-xs text-red-300">Failed to search users. Please try again.</p>
            )}
          </div>

          {selectedUsers.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Selected</p>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((selected) => (
                  <SelectedUserChip
                    key={selected.id}
                    user={selected}
                    onRemove={() => handleRemoveUser(selected.id)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Results</p>
            <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
              {trimmedSearch.length === 0 && (
                <p className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white/60">
                  Start typing to search for members.
                </p>
              )}

              {trimmedSearch.length > 0 && searchResults.length === 0 && !searchLoading && (
                <p className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white/60">
                  No users found.
                </p>
              )}

              {trimmedSearch.length > 0 &&
                searchResults.map((result) => (
                  <SearchResultRow
                    key={result.id}
                    user={result}
                    onSelect={() => handleSelectUser(result)}
                  />
                ))}
            </div>
          </div>
        </div>

        {addError && (
          <p className="mt-4 text-xs text-red-300">Failed to add members. Please try again.</p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-white/70 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 bg-emerald-500/80 text-white hover:bg-emerald-400/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {addLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const SearchResultRow = ({ user, onSelect }: { user: SearchUserResult; onSelect: () => void }) => (
  <button
    type="button"
    onClick={onSelect}
    className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-left transition hover:bg-white/10"
  >
    <div className="h-10 w-10 overflow-hidden rounded-full border border-white/10 bg-white/10">
      <Image
        src={user.avatarUrl || DEFAULT_AVATAR}
        alt={user.firstname ?? user.email}
        width={40}
        height={40}
        className="h-10 w-10 object-cover"
      />
    </div>
    <div className="flex-1">
      <p className="text-sm font-semibold text-white">
        {[user.firstname, user.lastname].filter(Boolean).join(" ") || user.email}
      </p>
      <p className="text-xs text-white/60">{user.email}</p>
    </div>
    <span className="text-xs font-semibold uppercase tracking-wide text-emerald-200">Add</span>
  </button>
);

const SelectedUserChip = ({ user, onRemove }: { user: SearchUserResult; onRemove: () => void }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white">
    <span className="flex items-center gap-2">
      <span className="h-8 w-8 overflow-hidden rounded-full border border-white/10 bg-white/10">
        <Image
          src={user.avatarUrl || DEFAULT_AVATAR}
          alt={user.firstname ?? user.email}
          width={32}
          height={32}
          className="h-8 w-8 object-cover"
        />
      </span>
      <span>{[user.firstname, user.lastname].filter(Boolean).join(" ") || user.email}</span>
    </span>
    <button
      type="button"
      onClick={onRemove}
      className="rounded-full p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
      aria-label="Remove selected user"
    >
      <X className="h-3.5 w-3.5" />
    </button>
  </span>
);

interface GroupSectionProps {
  detail: ChatroomDetail;
  isLoading: boolean;
}

const GroupDetailSection = ({ detail, isLoading }: GroupSectionProps) => {
  const totalMembers = detail.totalMembers ?? detail.members?.length ?? 0;

  return (
    <div className="space-y-6">
      <StatsGrid
        stats={[
          { label: "Members", value: totalMembers },
          { label: "Messages", value: detail.totalMessages },
          { label: "Shared photos", value: detail.totalPhotos },
        ]}
      />

      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">Members</h3>
        {(!detail.members || detail.members.length === 0) && !isLoading && (
          <p className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/60">
            No members found.
          </p>
        )}
        {detail.members && detail.members.length > 0 && (
          <div className="space-y-3">
            {detail.members.map((member) => (
              <div key={member.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10 bg-white/10">
                  <Image
                    src={member.avatarUrl || DEFAULT_AVATAR}
                    alt={member.firstname ?? "Member avatar"}
                    width={40}
                    height={40}
                    className="h-10 w-10 object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">
                    {[member.firstname, member.lastname].filter(Boolean).join(" ") || "Unknown"}
                  </p>
                  <p className="text-xs text-white/50">Member</p>
                </div>
                {member.isOwner && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">
                    <ShieldCheck className="h-3 w-3" />
                    Admin
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface DirectSectionProps {
  detail: ChatroomDetail;
  isLoading: boolean;
}

const DirectDetailSection = ({ detail, isLoading }: DirectSectionProps) => {
  const directUser = detail.directUser;

  return (
    <div className="space-y-6">
      <StatsGrid
        stats={[
          { label: "Messages", value: detail.totalMessages ?? 0 },
          { label: "Shared photos", value: detail.totalPhotos ?? 0 },
          { label: "Followers", value: directUser?.totalFollowers ?? 0 },
          { label: "Following", value: directUser?.totalFollowing ?? 0 },
        ]}
      />

      {directUser ? (
        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-white/10">
              <Image
                src={directUser.avatarUrl || DEFAULT_AVATAR}
                alt={directUser.firstname ?? "User avatar"}
                width={64}
                height={64}
                className="h-16 w-16 object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {[directUser.firstname, directUser.lastname].filter(Boolean).join(" ") || "Unknown user"}
              </h3>
              <p className="text-sm text-white/60">{directUser.email}</p>
            </div>
          </div>

          {directUser.bio && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-white/50">Bio</h4>
              <p className="mt-1 text-sm text-white/80">{directUser.bio}</p>
            </div>
          )}
        </div>
      ) : (
        !isLoading && (
          <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
            We couldn&apos;t load the other user details.
          </p>
        )
      )}
    </div>
  );
};

interface StatItem {
  label: string;
  value: number;
}

interface StatsGridProps {
  stats: StatItem[];
}

const StatsGrid = ({ stats }: StatsGridProps) => (
  <div className="grid gap-4 sm:grid-cols-2">
    {stats.map((stat) => (
      <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-wide text-white/50">{stat.label}</p>
        <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
      </div>
    ))}
  </div>
);
