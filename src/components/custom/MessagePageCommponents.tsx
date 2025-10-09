import { DEFAULT_AVATAR, MessageEdge } from "@/lib/types";
import { formatEditedTime, formatTime } from "@/lib/utils";
import clsx from "clsx";

export const Avatar = ({ src, alt }: { src?: string | null; alt: string }) => (
  <div className="h-10 w-10 overflow-hidden rounded-full border border-white/10 bg-white/10">
    <img src={src || DEFAULT_AVATAR} alt={alt} className="h-full w-full object-cover" />
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
        <div className="mt-3 overflow-hidden rounded-lg border border-white/10">
          <img
            src={message.imageUrl}
            alt="message attachment"
            className="max-h-64 w-full object-cover"
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
}: {
  isGroup: boolean;
  name: string;
  avatarUrl?: string | null;
  subtitle?: string | null;
}) => (
  <div className="flex items-center gap-4 border-b border-white/10 bg-white/5 px-8 py-6 backdrop-blur">
    <div className="h-16 w-16 overflow-hidden rounded-full border border-white/20 bg-white/10">
      <img src={avatarUrl || DEFAULT_AVATAR} alt={name} className="h-full w-full object-cover" />
    </div>
    <div>
      <h2 className="text-2xl font-semibold text-white">{name}</h2>
      <p className="text-sm text-white/60">{isGroup ? 'Group chat' : subtitle ?? 'Direct message'}</p>
    </div>
  </div>
);