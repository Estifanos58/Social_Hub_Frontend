import { useState } from "react";
import { DEFAULT_AVATAR, MessageEdge } from "@/lib/types";
import { Info } from "lucide-react";
import { formatEditedTime, formatTime } from "@/lib/utils";
import clsx from "clsx";
import Image from "next/image";
import { MessageImageModal } from "@/components/modal/MessageImageModal";
import { Button } from "../../ui/button";

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
  const [isImageOpen, setImageOpen] = useState(false);
  const editedLabel = formatEditedTime(message.createdAt, message.updatedAt);
  const bubble = (
    <div
      className={clsx('md:w-[300px] lg:w-[400px] max-w-4xl rounded-2xl border border-white/10 p-4 shadow-lg backdrop-blur md:max-w-3xl', {
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
        <>
          <button
            type="button"
            onClick={() => setImageOpen(true)}
            className="group relative mt-3 block w-full overflow-hidden rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400/70"
          >
            <span className="relative block min-h-[220px] md:min-h-[420px]">
              <Image
                src={message.imageUrl}
                alt="message attachment"
                fill
                sizes="(max-width: 768px) 100vw, 900px"
                className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </span>
          </button>
          <MessageImageModal
            open={isImageOpen}
            onOpenChange={setImageOpen}
            imageUrl={message.imageUrl}
            senderName={message.user?.firstname}
            messageId={message.id}
          />
        </>
      )}
      {editedLabel && <p className="mt-3 text-xs italic text-white/60">{editedLabel}</p>}
    </div>
  );

  return (
    <div
      className={clsx('flex items-start gap-3', {
        'flex-row-reverse': isOwn,
        'flex-row': !isOwn,
      })}
    >
      <Avatar src={message.user?.avatarUrl} alt={`${message.user?.firstname ?? 'User'} avatar`} />
      <div className={clsx('flex flex-1', {
        'justify-end': isOwn,
        'justify-start': !isOwn,
      })}
      >
        {bubble}
      </div>
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