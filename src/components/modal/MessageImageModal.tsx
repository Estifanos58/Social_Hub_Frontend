"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Download, X } from "lucide-react";
import Image from "next/image";

interface MessageImageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl?: string | null;
  senderName?: string | null;
  messageId?: string;
}

export const MessageImageModal = ({
  open,
  onOpenChange,
  imageUrl,
  senderName,
  messageId,
}: MessageImageModalProps) => {
  if (!imageUrl) {
    return null;
  }

  const filename = messageId ? `message-${messageId}` : "message-image";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-4xl overflow-hidden border border-white/10 bg-gray-900 p-0 text-white lg:max-w-5xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <p className="text-sm text-white/70">
            {senderName ? `${senderName} sent an image` : "Image preview"}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-white/20 bg-white/5 text-white hover:bg-white/10"
            >
              <a
                href={imageUrl}
                download={filename}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                <span className="text-xs font-medium">Download</span>
              </a>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              aria-label="Close image preview"
              className="text-white/80 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative flex items-center justify-center bg-black/80">
          <div className="relative h-[60vh] w-full max-w-full">
            <Image
              src={imageUrl}
              alt="message attachment preview"
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-contain"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
