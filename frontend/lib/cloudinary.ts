/**
 * Cloudinary image upload utility
 * Note: Uploads go directly to Cloudinary (not our API)
 * Deletion goes through our API (requires API secret)
 */
import { API_URL } from "./api"

interface UploadResponse {
  secure_url: string
  public_id: string
  width: number
  height: number
}

/**
 * Upload image to Cloudinary
 * @param file - File to upload
 * @param folder - Optional folder path in Cloudinary
 * @returns Promise with upload result
 */
export async function uploadToCloudinary(
  file: File,
  folder: string = "dineontime/restaurants"
): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "dineontime")
  formData.append("folder", folder)

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || "Failed to upload image")
    }

    const data = await response.json()
    return {
      secure_url: data.secure_url,
      public_id: data.public_id,
      width: data.width,
      height: data.height,
    }
  } catch (error: any) {
    console.error("Cloudinary upload error:", error)
    throw new Error(error.message || "Failed to upload image")
  }
}

/**
 * Upload multiple images to Cloudinary
 */
export async function uploadMultipleToCloudinary(
  files: File[],
  folder: string = "dineontime/restaurants"
): Promise<UploadResponse[]> {
  const uploadPromises = files.map((file) => uploadToCloudinary(file, folder))
  return Promise.all(uploadPromises)
}

/**
 * Delete image from Cloudinary
 * Note: This requires a backend endpoint to handle deletion with API secret
 * Uses API_URL to ensure consistency with other API calls
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    const response = await fetch(
      `${API_URL}/api/cloudinary/delete?publicId=${encodeURIComponent(publicId)}`,
      {
        method: "DELETE",
      }
    )

    if (!response.ok) {
      throw new Error("Failed to delete image")
    }
  } catch (error: any) {
    console.error("Cloudinary delete error:", error)
    throw new Error(error.message || "Failed to delete image")
  }
}

