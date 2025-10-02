export const MessagesSkeleton = () => (
  <div className="flex flex-col gap-6 px-8 py-10">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-white/10 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 rounded bg-white/10 animate-pulse" />
          <div className="h-4 w-2/3 rounded bg-white/10 animate-pulse" />
          <div className="h-4 w-1/4 rounded bg-white/10 animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

export const ChatHeaderSkeleton = () => (
  <div className="flex items-center gap-4 border-b border-white/10 bg-white/5 px-8 py-6">
    <div className="h-16 w-16 rounded-full bg-white/10 animate-pulse" />
    <div className="space-y-2">
      <div className="h-5 w-40 rounded bg-white/10 animate-pulse" />
      <div className="h-4 w-24 rounded bg-white/10 animate-pulse" />
    </div>
  </div>
);

export const EmptyState = () => (
  <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-white/70">
    <p className="text-lg font-semibold text-white">No messages yet</p>
    <p className="text-sm">Start the conversation by sending the first message.</p>
  </div>
);