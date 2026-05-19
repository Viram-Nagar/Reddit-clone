import { useCallback, useRef, useState } from "react";
import { Upload, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import ImagePreview from "./ImagePreview";
import UploadProgress from "./UploadProgress";
import useImageUpload from "../../hooks/useImageUpload";

const ImageUpload = ({ onImageChange, onPublicIdChange }) => {
  const [mode, setMode] = useState("upload"); // 'upload' | 'url'
  const [urlInput, setUrlInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const {
    imageUrl,
    preview,
    isUploading,
    progress,
    error,
    uploadFile,
    removeImage,
    setImageUrl,
    setPreview,
  } = useImageUpload();

  // Notify parent when image changes
  const handleImageChange = useCallback(
    (url, pubId = "") => {
      onImageChange?.(url);
      onPublicIdChange?.(pubId);
    },
    [onImageChange, onPublicIdChange],
  );

  // ── File selection ──────────────────────────────────
  const handleFileSelect = async (file) => {
    if (!file) return;
    const success = await uploadFile(file);
    if (success) {
      // imageUrl is set inside hook — read after state updates
      setTimeout(() => {
        const url =
          document.querySelector("[data-image-url]")?.dataset.imageUrl;
      }, 100);
    }
  };

  // Watch for imageUrl changes from hook
  const handleUploadComplete = useCallback(
    (url, pubId) => {
      handleImageChange(url, pubId);
    },
    [handleImageChange],
  );

  // ── Drop zone handlers ──────────────────────────────
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) await handleFile(file);
  };

  const handleFile = async (file) => {
    const success = await uploadFile(file);
    if (success) {
      // Give state time to update
      setTimeout(() => {
        handleImageChange(imageUrl);
      }, 500);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  // ── URL mode ────────────────────────────────────────
  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;
    setImageUrl(urlInput);
    setPreview(urlInput);
    handleImageChange(urlInput, "");
  };

  // ── Remove image ────────────────────────────────────
  const handleRemove = async () => {
    await removeImage();
    setUrlInput("");
    handleImageChange("", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      {/* Mode switcher */}
      {!preview && (
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              mode === "upload"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Upload size={13} /> Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              mode === "url"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <LinkIcon size={13} /> Paste URL
          </button>
        </div>
      )}

      {/* Upload mode */}
      {mode === "upload" && !preview && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-reddit-orange bg-orange-50 scale-[1.01]"
              : "border-gray-300 hover:border-reddit-orange hover:bg-orange-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleInputChange}
            className="hidden"
          />

          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors ${
              isDragging ? "bg-reddit-orange" : "bg-gray-100"
            }`}
          >
            <ImageIcon
              size={24}
              className={isDragging ? "text-white" : "text-gray-400"}
            />
          </div>

          <p
            className={`font-semibold text-sm mb-1 ${
              isDragging ? "text-reddit-orange" : "text-gray-700"
            }`}
          >
            {isDragging ? "Drop your image here!" : "Drag & drop an image"}
          </p>
          <p className="text-xs text-gray-400 mb-3">or click to browse files</p>
          <p className="text-xs text-gray-400">JPG, PNG, GIF, WebP · Max 5MB</p>
        </div>
      )}

      {/* URL mode */}
      {mode === "url" && !preview && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="input flex-1 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
              className="btn-primary text-sm px-4 disabled:opacity-50"
            >
              Add
            </button>
          </div>
          <p className="text-xs text-gray-400">
            Paste a direct link to an image
          </p>
        </div>
      )}

      {/* Upload progress */}
      <UploadProgress
        progress={progress}
        isUploading={isUploading}
        error={error}
      />

      {/* Image preview */}
      <ImagePreview
        src={preview}
        onRemove={handleRemove}
        isUploading={isUploading}
      />
    </div>
  );
};

export default ImageUpload;
