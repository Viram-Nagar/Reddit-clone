import { X, ZoomIn } from "lucide-react";
import { useState } from "react";

const ImagePreview = ({ src, onRemove, isUploading }) => {
  const [zoomed, setZoomed] = useState(false);

  if (!src) return null;

  return (
    <>
      {/* Preview container */}
      <div className="relative mt-3 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group">
        <img
          src={src}
          alt="Upload preview"
          className="w-full max-h-72 object-contain"
          onError={(e) => {
            e.target.src = "";
            e.target.alt = "Failed to load image";
          }}
        />

        {/* Overlay actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          {/* Zoom button */}
          <button
            type="button"
            onClick={() => setZoomed(true)}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:scale-105 transition-transform"
          >
            <ZoomIn size={16} className="text-gray-700" />
          </button>

          {/* Remove button */}
          {!isUploading && (
            <button
              type="button"
              onClick={onRemove}
              className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:scale-105 transition-transform"
            >
              <X size={16} className="text-red-500" />
            </button>
          )}
        </div>

        {/* Uploading overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-[3px] border-gray-200 border-t-reddit-orange" />
          </div>
        )}

        {/* Remove button (always visible on mobile) */}
        {!isUploading && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 w-7 h-7 bg-black bg-opacity-50 rounded-full flex items-center justify-center lg:hidden"
          >
            <X size={14} className="text-white" />
          </button>
        )}
      </div>

      {/* Fullscreen zoom modal */}
      {zoomed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setZoomed(false)}
        >
          <button
            onClick={() => setZoomed(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
          <img
            src={src}
            alt="Full size preview"
            className="max-w-full max-h-full object-contain rounded"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default ImagePreview;
