import { useCallback, useRef, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";

import { CREATE_POST } from "@/graphql/mutations/post/CreatePost";
import { uploadImageToCloudinary } from "@/lib/uploadFile";

export interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

interface UseCreatePostReturn {
  images: ImageFile[];
  setImages: React.Dispatch<React.SetStateAction<ImageFile[]>>;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  isDragOver: boolean;
  setIsDragOver: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  loading: boolean;
  isUploading: boolean;
  progressMap: Record<string, number>;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (id: string) => void;
  openFileDialog: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export const useCreatePost = (): UseCreatePostReturn => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [content, setContent] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  const [createPost, { loading }] = useMutation(CREATE_POST, {
    onCompleted: () => {
      toast.success("Post created successfully!");
      setContent("");
      setImages([]);
      setIsOpen(false);
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to create post.");
    },
  });

  const processFiles = useCallback((files: FileList) => {
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));

    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage: ImageFile = {
          file,
          preview: e.target?.result as string,
          id: Math.random().toString(36).substr(2, 9),
        };
        setImages((prev) => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        processFiles(files);
      }
    },
    [processFiles],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        processFiles(files);
      }
    },
    [processFiles],
  );

  const removeImage = useCallback((id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setProgressMap((p) => {
      const copy = { ...p };
      delete copy[id];
      return copy;
    });
  }, []);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!content.trim()) return;
      if (isUploading) return;

      try {
        let imageUrls: string[] = [];
        if (images.length > 0) {
          setIsUploading(true);
          const uploadPromises = images.map((img) =>
            uploadImageToCloudinary(img.file, (percent) => {
              setProgressMap((prev) => ({ ...prev, [img.id]: percent }));
            }),
          );

          const results = await Promise.all(uploadPromises);

          imageUrls = results
            .filter((r) => r.success && r.url)
            .map((r) => r.url as string);

          const failed = results.filter((r) => !r.success);
          if (failed.length > 0) {
            toast.error(`${failed.length} image(s) failed to upload. Proceeding with uploaded ones.`);
          }
        }

        console.log("Image URLs:", imageUrls);
        console.log("Content", content);

        await createPost({
          variables: { content, imageUrls },
        });
      } catch (err: any) {
        console.error(err);
        if (!err?.message) {
          toast.error("Something went wrong while creating the post.");
        }
      } finally {
        setIsUploading(false);
        setProgressMap({});
      }
    },
    [content, createPost, images, isUploading],
  );

  return {
    images,
    setImages,
    content,
    setContent,
    isDragOver,
    setIsDragOver,
    isOpen,
    setIsOpen,
    fileInputRef,
    loading,
    isUploading,
    progressMap,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    removeImage,
    openFileDialog,
    handleSubmit,
  };
};
