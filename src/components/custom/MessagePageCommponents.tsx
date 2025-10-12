import { DEFAULT_AVATAR, MessageEdge } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { formatEditedTime, formatTime } from "@/lib/utils";
import clsx from "clsx";
import Image from "next/image";

export const Avatar = ({ src, alt }: { src?: string | null; alt: string }) => (
  <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10 bg-white/10">
    <Image
      src={src || DEFAULT_AVATAR}
      alt={alt}
      fill
      sizes="40px"
      className="object-cover"
    />
  </div>
);

export const MessageBubble = ({ message, isOwn }: { message: MessageEdge; isOwn: boolean }) => {
  const editedLabel = formatEditedTime(message.createdAt, message.updatedAt);
  const bubble = (
    <div
      className={clsx('max-w-lg rounded-2xl border border-white/10 p-4 shadow-lg backdrop-blur', {
        'bg-emerald-500/10': isOwn,
        'bg-white/5': !isOwn,
      })}
    >
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm font-semibold text-white">
          {message.user?.firstname ?? 'Unknown'}
        </p>
        <span className="text-xs text-white/60">{formatTime(message.createdAt)}</span>
      </div>
      {message.content && (
        <p className="mt-2 whitespace-pre-wrap text-sm text-white/90">{message.content}</p>
      )}
      {message.imageUrl && (
        <div
          className="relative mt-3 w-full overflow-hidden rounded-lg border border-white/10"
          style={{ minHeight: 200 }}
        >
          <Image
            src={message.imageUrl}
            alt="message attachment"
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
          />
        </div>
      )}
      {editedLabel && <p className="mt-3 text-xs italic text-white/60">{editedLabel}</p>}
    </div>
  );

  return (
    <div
      className={clsx('flex items-start gap-3', {
        'justify-start': isOwn,
        'justify-end': !isOwn,
      })}
    >
      {isOwn && <Avatar src={message.user?.avatarUrl} alt={`${message.user?.firstname ?? 'User'} avatar`} />}
      {bubble}
      {!isOwn && (
        <Avatar src={message.user?.avatarUrl} alt={`${message.user?.firstname ?? 'User'} avatar`} />
      )}
    </div>
  );
};

export const ChatHeader = ({
  isGroup,
  name,
  avatarUrl,
  subtitle,
  onShowDetail,
  disableDetailButton = false,
}: {
  isGroup: boolean;
  name: string;
  avatarUrl?: string | null;
  subtitle?: string | null;
  onShowDetail?: () => void;
  disableDetailButton?: boolean;
}) => (
  <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-white/5 px-8 py-6 backdrop-blur">
    <div className="flex items-center gap-4">
      <div className="relative h-16 w-16 overflow-hidden rounded-full border border-white/20 bg-white/10">
        <Image
          src={avatarUrl || DEFAULT_AVATAR}
          alt={name}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-white">{name}</h2>
        <p className="text-sm text-white/60">{isGroup ? "Group chat" : subtitle ?? "Direct message"}</p>
      </div>
    </div>
    {onShowDetail && (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onShowDetail}
        disabled={disableDetailButton}
        className="border-white/20 bg-white/5 text-white hover:bg-white/10"
      >
        <Info className="mr-2 h-4 w-4" />
        View details
      </Button>
    )}
  </div>
);