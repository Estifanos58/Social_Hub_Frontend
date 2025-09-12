"use client";

import React, { useState } from "react";
import { CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Camera } from "lucide-react";

interface ImageUploadProps {
  formData: {
    avatarUrl: string;
    firstName: string;
    lastName: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function ImageUpload({
  formData,
  setFormData,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setStatusMessage(null);

    try {
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

      console.log("Upload Preset:", uploadPreset);
      console.log("Cloud Name:", cloudName);
      
      const formDataCloud = new FormData();
      formDataCloud.append("file", file);
      formDataCloud.append("upload_preset", uploadPreset!); // Replace with your preset
      formDataCloud.append("cloud_name", cloudName!); // Replace with your Cloudinary cloud name

      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        true
      );

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          setProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        setUploading(false);
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setFormData((prev: any) => ({
            ...prev,
            avatarUrl: response.secure_url,
          }));
          setStatusMessage({ text: "Upload successful!", type: "success" });
        } else {
          setStatusMessage({
            text: "Upload failed. Try again.",
            type: "error",
          });
        }
      };

      xhr.onerror = () => {
        setUploading(false);
        setStatusMessage({
          text: "Upload failed. Network error.",
          type: "error",
        });
      };

      xhr.send(formDataCloud);
    } catch (err) {
      setUploading(false);
      setStatusMessage({
        text: "Upload failed. Something went wrong.",
        type: "error",
      });
    }
  };

  return (
    <div>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24 relative">
              <AvatarImage
                src={formData.avatarUrl || "/placeholder.svg"}
                alt="Profile"
              />
              <AvatarFallback className="text-lg">
                {formData.firstName?.[0] ?? ""}
                {formData.lastName?.[0] ?? ""}
              </AvatarFallback>

              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <p className="text-white font-medium">{progress}%</p>
                </div>
              )}
            </Avatar>

            <label
              htmlFor="profile-upload"
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="h-6 w-6 text-white" />
            </label>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          <div className="flex flex-col">
            <p className="text-sm text-muted-foreground mb-2">
              Click on the avatar to upload a new picture
            </p>
            <p className="text-xs text-muted-foreground mb-1">
              JPG, PNG or GIF. Max size 5MB.
            </p>

            {statusMessage && (
              <p
                className={`text-sm font-medium ${
                  statusMessage.type === "success"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {statusMessage.text}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </div>
  );
}
