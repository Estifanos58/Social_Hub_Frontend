import { FormEvent, useCallback, useEffect, useMemo, useState, ChangeEvent } from "react";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";

import { CREATE_CHATROOM } from "@/graphql/mutations/message/CreateChatroom";
import { useCloudinaryImageUpload } from "@/hooks/useCloudinaryImageUpload";

interface CreateChatroomResponse {
  createChatroomMutation: string;
}

interface CreateChatroomVariables {
  chatroomName?: string;
  isGroupChat?: boolean;
  otherUserId?: string;
  avatarUrl?: string;
}

type OnCreatedCallback = (chatroomId: string) => Promise<void> | void;

interface UseCreateGroupChatOptions {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: OnCreatedCallback;
}

interface UseCreateGroupChatResult {
  groupName: string;
  handleGroupNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
  canSubmit: boolean;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  selectedImage: ReturnType<typeof useCloudinaryImageUpload>["selectedImage"];
  handleFileChange: ReturnType<typeof useCloudinaryImageUpload>["handleFileChange"];
  clearSelectedImage: ReturnType<typeof useCloudinaryImageUpload>["clearSelectedImage"];
  progress: ReturnType<typeof useCloudinaryImageUpload>["progress"];
  isUploading: ReturnType<typeof useCloudinaryImageUpload>["isUploading"];
  fileInputRef: ReturnType<typeof useCloudinaryImageUpload>["fileInputRef"];
  openFilePicker: ReturnType<typeof useCloudinaryImageUpload>["openFilePicker"];
}

export const useCreateGroupChat = ({
  isOpen,
  onClose,
  onCreated,
}: UseCreateGroupChatOptions): UseCreateGroupChatResult => {
  const [groupName, setGroupName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createChatroom] = useMutation<CreateChatroomResponse, CreateChatroomVariables>(
    CREATE_CHATROOM,
  );

  const {
    selectedImage,
    handleFileChange,
    clearSelectedImage,
    uploadSelectedImage,
    progress,
    isUploading,
    fileInputRef,
    openFilePicker,
  } = useCloudinaryImageUpload({ maxSizeMb: 5 });

  const canSubmit = useMemo(
    () => groupName.trim().length > 0 && !isSubmitting && !isUploading,
    [groupName, isSubmitting, isUploading],
  );

  const resetForm = useCallback(() => {
    setGroupName("");
    clearSelectedImage();
    setIsSubmitting(false);
  }, [clearSelectedImage]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const handleGroupNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setGroupName(event.target.value);
    },
    [],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmedName = groupName.trim();
      if (!trimmedName) {
        toast.error("Please enter a group name");
        return;
      }

      setIsSubmitting(true);
      try {
        let avatarUrl: string | undefined;
        if (selectedImage) {
          avatarUrl = (await uploadSelectedImage()) ?? undefined;
          if (!avatarUrl) {
            return;
          }
        }

        const { data } = await createChatroom({
          variables: {
            chatroomName: trimmedName,
            isGroupChat: true,
            avatarUrl,
          },
        });

        const chatroomId: string | undefined = data?.createChatroomMutation ?? undefined;
        if (!chatroomId) {
          toast.error("Failed to create group. Please try again.");
          return;
        }

        toast.success("Group chat created");
        await onCreated?.(chatroomId);
        onClose();
      } catch (error) {
        toast.error("Failed to create group. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [createChatroom, groupName, onClose, onCreated, selectedImage, uploadSelectedImage],
  );

  return {
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
  };
};
