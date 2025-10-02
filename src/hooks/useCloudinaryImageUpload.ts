import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { uploadImageToCloudinary } from '@/lib/uploadFile';
import { toast } from 'sonner';

interface SelectedImage {
  file: File;
  preview: string;
}

interface UseCloudinaryImageUploadOptions {
  maxSizeMb?: number;
  onValidationError?: (message: string) => void;
  onUploadError?: (message: string) => void;
}

const bytesFromMb = (mb: number) => mb * 1024 * 1024;

export const useCloudinaryImageUpload = ({
  maxSizeMb = 10,
  onValidationError,
  onUploadError,
}: UseCloudinaryImageUploadOptions = {}) => {
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const notifyValidationError = useCallback(
    (message: string) => {
      if (onValidationError) {
        onValidationError(message);
      } else {
        toast.error(message);
      }
    },
    [onValidationError],
  );

  const notifyUploadError = useCallback(
    (message: string) => {
      if (onUploadError) {
        onUploadError(message);
      } else {
        toast.error(message);
      }
    },
    [onUploadError],
  );

  useEffect(() => {
    return () => {
      if (selectedImage?.preview) {
        URL.revokeObjectURL(selectedImage.preview);
      }
    };
  }, [selectedImage]);

  const resetInputValue = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const assignSelectedImage = useCallback((file: File) => {
    const preview = URL.createObjectURL(file);
    setSelectedImage((current) => {
      if (current?.preview) {
        URL.revokeObjectURL(current.preview);
      }
      return { file, preview };
    });
    setProgress(null);
  }, []);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        notifyValidationError('Only image files are allowed');
        resetInputValue();
        return;
      }

      if (file.size > bytesFromMb(maxSizeMb)) {
        notifyValidationError(`Image must be smaller than ${maxSizeMb}MB`);
        resetInputValue();
        return;
      }

      assignSelectedImage(file);
      resetInputValue();
    },
    [assignSelectedImage, maxSizeMb, notifyValidationError, resetInputValue],
  );

  const clearSelectedImage = useCallback(() => {
    setSelectedImage((current) => {
      if (current?.preview) {
        URL.revokeObjectURL(current.preview);
      }
      return null;
    });
    setProgress(null);
    resetInputValue();
  }, [resetInputValue]);

  const performUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setProgress(0);
      try {
        const result = await uploadImageToCloudinary(file, (percent) => setProgress(percent));
        if (!result.success || !result.url) {
          notifyUploadError(result.error ?? 'Upload failed. Try again.');
          return null;
        }
        return result.url;
      } catch (error) {
        notifyUploadError('Upload failed. Try again.');
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [notifyUploadError],
  );

  const uploadSelectedImage = useCallback(async () => {
    if (!selectedImage) return null;
    const url = await performUpload(selectedImage.file);
    return url;
  }, [performUpload, selectedImage]);

  const uploadFile = useCallback(
    async (file: File) => {
      assignSelectedImage(file);
      const url = await performUpload(file);
      return url;
    },
    [assignSelectedImage, performUpload],
  );

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    selectedImage,
    handleFileChange,
    clearSelectedImage,
    uploadSelectedImage,
    uploadFile,
    progress,
    isUploading,
    fileInputRef,
    openFilePicker,
  };
};
