"use client";

import Image from "next/image";
import { Loader2, ImagePlus, Trash2 } from "lucide-react";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateGroupChat } from "@/hooks/chatroom/useCreateGroupChat";

interface CreateGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (chatroomId: string) => Promise<void> | void;
}

export function CreateGroupModal({ open, onOpenChange, onCreated }: CreateGroupModalProps) {
  const {
    groupName,
    handleGroupNameChange,
    isSubmitting,
    canSubmit,
    handleSubmit,
    selectedImage,
    handleFileChange,
    clearSelectedImage,
    progress,
    isUploading,
    fileInputRef,
    openFilePicker,
  } = useCreateGroupChat({
    isOpen: open,
    onClose: () => onOpenChange(false),
    onCreated,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 text-white border border-white/10" showCloseButton>
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Create group chat</DialogTitle>
            <DialogDescription className="text-white/60">
              Give your group a name and optional avatar so everyone recognizes it instantly.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="group-name" className="text-white/80">
                Group name
              </Label>
              <Input
                id="group-name"
                placeholder="Team awesome"
                value={groupName}
                onChange={handleGroupNameChange}
                maxLength={60}
                className="bg-gray-800 border-white/10 text-white placeholder:text-white/40"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-white/80">Group image (optional)</Label>
              {selectedImage ? (
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 overflow-hidden rounded-xl border border-white/10">
                    <Image
                      src={selectedImage.preview}
                      alt="Selected group avatar"
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearSelectedImage}
                    className="text-white/70 hover:text-white"
                    disabled={isUploading || isSubmitting}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={openFilePicker}
                  disabled={isUploading || isSubmitting}
                  className="w-full justify-center border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  <ImagePlus className="mr-2 h-4 w-4" />
                  Upload image
                </Button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {progress !== null && isUploading && (
                <p className="text-xs text-white/60">Uploading… {progress}%</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-white/70 hover:text-white"
              disabled={isSubmitting || isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit}
              className="bg-emerald-500 hover:bg-emerald-400 text-white"
            >
              {isSubmitting || isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
