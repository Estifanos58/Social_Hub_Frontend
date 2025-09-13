export interface UploadResult {
  success: boolean
  error: string | null
  url: string | null
}

export async function uploadImageToCloudinary(
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  return new Promise((resolve) => {
    if (!file) {
      return resolve({
        success: false,
        error: "No file provided",
        url: null,
      })
    }

    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

    if (!uploadPreset || !cloudName) {
      return resolve({
        success: false,
        error: "Cloudinary environment variables are missing",
        url: null,
      })
    }

    const formDataCloud = new FormData()
    formDataCloud.append("file", file)
    formDataCloud.append("upload_preset", uploadPreset)
    formDataCloud.append("cloud_name", cloudName)

    const xhr = new XMLHttpRequest()
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, true)

    // Track progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percentComplete = Math.round((event.loaded / event.total) * 100)
        onProgress(percentComplete)
      }
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText)
        resolve({
          success: true,
          error: null,
          url: response.secure_url,
        })
      } else {
        resolve({
          success: false,
          error: "Upload failed. Try again.",
          url: null,
        })
      }
    }

    xhr.onerror = () => {
      resolve({
        success: false,
        error: "Upload failed. Network error.",
        url: null,
      })
    }

    xhr.send(formDataCloud)
  })
}
