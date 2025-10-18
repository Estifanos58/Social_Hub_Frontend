"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, Upload, ImageIcon, Plus } from "lucide-react"
import { useGeneralStore } from "@/store/generalStore"
import { useCreatePost } from "@/hooks/post/useCreatePost"

function CreatePost() {
  const { isCollapsed, isMobile } = useGeneralStore()
  const {
    images,
    content,
    setContent,
    isDragOver,
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
  } = useCreatePost()

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
          aria-label="Create post"
        >
          <Plus className="w-4 h-4" />
          {isCollapsed ? "" : "Create Post"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-700 text-white">
        {!isMobile && (
          <DialogHeader>
            <DialogTitle className="text-white">Create New Post</DialogTitle>
          </DialogHeader>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="content" className="text-white">
              What's on your mind?
            </Label>
            <Textarea
              id="content"
              placeholder="Write your post content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-gray-500"
              required
            />
          </div>

          <div className="space-y-4">
            <Label className="text-white">Images</Label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={openFileDialog}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${
                  isDragOver
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-gray-600 hover:border-gray-500 bg-gray-800/50"
                }
              `}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-300 mb-2">Drag and drop images here, or click to select</p>
              <p className="text-sm text-gray-500">Supports: JPG, PNG, GIF, WebP</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.preview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg bg-gray-800"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* progress overlay while uploading */}
                    {isUploading && progressMap[image.id] != null && (
                      <div className="absolute inset-0 bg-black/50 flex items-end">
                        <div className="w-full">
                          <div className="h-1 bg-gray-600">
                            <div
                              style={{ width: `${progressMap[image.id]}%` }}
                              className="h-1 bg-green-500 transition-all"
                            />
                          </div>
                          <div className="text-xs text-white text-right pr-1">{progressMap[image.id]}%</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={loading || isUploading || !content.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {loading ? "Posting..." : (
                <>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreatePost
