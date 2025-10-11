"use client";

import Image from "next/image";
import { Loader2, ShieldCheck } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DEFAULT_AVATAR, ChatroomDetail } from "@/lib/types";
import { useChatroomDetail } from "@/hooks/message/useChatroomDetail";
import type { ChatroomMeta } from "@/lib/types";

interface ChatroomDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chatroomId?: string | null;
  otherUserId?: string;
  meta?: ChatroomMeta;
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

  const showSkeleton = isInitialLoading;
  const showContent = Boolean(detail && (hasRemoteDetail || !showSkeleton));

  return (
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
  );
}

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
