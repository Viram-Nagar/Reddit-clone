import { useNavigate } from "react-router-dom";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    resetErrorBoundary();
    navigate("/");
  };

  const isDev = import.meta.env.DEV;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow-sm">
          {/* Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <AlertTriangle size={28} className="text-red-500" />
          </div>

          {/* Message */}
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            An unexpected error occurred. This has been noted and we'll look
            into it.
          </p>

          {/* Error details in dev mode only */}
          {isDev && error?.message && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-6 text-left">
              <p className="text-xs font-mono text-red-700 break-all">
                {error.message}
              </p>
              {error.stack && (
                <pre className="text-xs font-mono text-red-500 mt-2 whitespace-pre-wrap overflow-auto max-h-32">
                  {error.stack}
                </pre>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={resetErrorBoundary}
              className="btn-secondary flex items-center gap-2"
            >
              <RefreshCw size={14} />
              Try Again
            </button>
            <button
              onClick={handleGoHome}
              className="btn-primary flex items-center gap-2"
            >
              <Home size={14} />
              Go Home
            </button>
          </div>
        </div>

        {/* Reddit branding */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Reddit Clone — Something went wrong on our end
        </p>
      </div>
    </div>
  );
};

export default ErrorFallback;
