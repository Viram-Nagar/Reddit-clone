import { CheckCircle, XCircle } from "lucide-react";

const UploadProgress = ({ progress, isUploading, error }) => {
  if (!isUploading && progress === 0 && !error) return null;

  return (
    <div className="mt-2 space-y-1">
      {/* Progress bar */}
      {(isUploading || progress > 0) && !error && (
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {progress < 100 ? "Uploading..." : "Processing..."}
            </span>
            <span className="text-xs font-medium text-reddit-orange">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-reddit-orange h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Success */}
      {!isUploading && progress === 100 && !error && (
        <div className="flex items-center gap-1.5 text-xs text-green-600">
          <CheckCircle size={13} />
          Image uploaded successfully
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-500">
          <XCircle size={13} />
          {error}
        </div>
      )}
    </div>
  );
};

export default UploadProgress;
