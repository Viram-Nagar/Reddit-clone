import {
  AlertCircle,
  RefreshCw,
  Lock,
  WifiOff,
  ServerCrash,
} from "lucide-react";

const ERROR_CONFIGS = {
  401: {
    icon: <Lock size={20} className="text-yellow-500" />,
    title: "Authentication Required",
    message: "Please log in to access this content.",
    bg: "bg-yellow-50 border-yellow-200",
    textColor: "text-yellow-800",
  },
  403: {
    icon: <Lock size={20} className="text-red-500" />,
    title: "Access Denied",
    message: "You don't have permission to perform this action.",
    bg: "bg-red-50 border-red-200",
    textColor: "text-red-800",
  },
  404: {
    icon: <AlertCircle size={20} className="text-gray-400" />,
    title: "Not Found",
    message: "The resource you requested could not be found.",
    bg: "bg-gray-50 border-gray-200",
    textColor: "text-gray-700",
  },
  429: {
    icon: <AlertCircle size={20} className="text-orange-500" />,
    title: "Too Many Requests",
    message: "You are doing that too fast. Please slow down.",
    bg: "bg-orange-50 border-orange-200",
    textColor: "text-orange-800",
  },
  500: {
    icon: <ServerCrash size={20} className="text-red-500" />,
    title: "Server Error",
    message: "Something went wrong on our end. Please try again.",
    bg: "bg-red-50 border-red-200",
    textColor: "text-red-800",
  },
  network: {
    icon: <WifiOff size={20} className="text-gray-500" />,
    title: "Connection Error",
    message: "Could not connect to the server. Check your internet.",
    bg: "bg-gray-50 border-gray-200",
    textColor: "text-gray-700",
  },
};

const ApiError = ({ statusCode, message, onRetry, className = "" }) => {
  const config = ERROR_CONFIGS[statusCode] || ERROR_CONFIGS[500];

  return (
    <div className={`border rounded-md p-4 ${config.bg} ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${config.textColor}`}>
            {config.title}
          </p>
          <p className={`text-xs mt-0.5 ${config.textColor} opacity-80`}>
            {message || config.message}
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex-shrink-0 flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            <RefreshCw size={12} />
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ApiError;
