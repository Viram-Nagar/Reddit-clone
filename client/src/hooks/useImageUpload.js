import { useState, useCallback } from "react";
import api from "../service/api.js";
import toast from "react-hot-toast";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

const useImageUpload = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [publicId, setPublicId] = useState("");
  const [preview, setPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  // ── Validate file before upload ────────────────────
  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Only JPG, PNG, GIF, and WebP images are allowed";
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large. Max size is ${MAX_FILE_SIZE / 1024 / 1024}MB`;
    }
    return null;
  };

  // ── Upload file to server → Cloudinary ─────────────
  const uploadFile = useCallback(async (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return false;
    }

    setError("");
    setIsUploading(true);
    setProgress(0);

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await api.post("/upload/post-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setProgress(percent);
        },
      });

      setImageUrl(data.imageUrl);
      setPublicId(data.publicId);
      setProgress(100);

      // Clean up local blob URL
      URL.revokeObjectURL(localPreview);
      setPreview(data.imageUrl); // Use Cloudinary URL

      toast.success("Image uploaded!");
      return true;
    } catch (err) {
      const message =
        err.response?.data?.message || "Upload failed. Please try again.";
      setError(message);
      setPreview("");
      toast.error(message);
      return false;
    } finally {
      setIsUploading(false);
    }
  }, []);

  // ── Upload avatar ───────────────────────────────────
  const uploadAvatar = useCallback(async (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      toast.error(validationError);
      return null;
    }

    setIsUploading(true);
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const { data } = await api.post("/upload/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });

      URL.revokeObjectURL(localPreview);
      setPreview(data.imageUrl);
      setImageUrl(data.imageUrl);

      toast.success("Avatar updated!");
      return data.user;
    } catch (err) {
      setPreview("");
      toast.error("Failed to update avatar");
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  // ── Remove image ────────────────────────────────────
  const removeImage = useCallback(async () => {
    if (publicId) {
      try {
        await api.delete("/upload/image", { data: { publicId } });
      } catch {
        // Non-blocking — just log
        console.warn("Could not delete image from Cloudinary");
      }
    }

    setImageUrl("");
    setPublicId("");
    setPreview("");
    setProgress(0);
    setError("");
  }, [publicId]);

  return {
    imageUrl,
    publicId,
    preview,
    isUploading,
    progress,
    error,
    uploadFile,
    uploadAvatar,
    removeImage,
    setImageUrl,
    setPreview,
  };
};

export default useImageUpload;
