import toast from "react-hot-toast";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

// ─── Custom toast functions ────────────────────────────
export const showToast = {
  success: (message, options = {}) =>
    toast.custom(
      (t) => (
        <CustomToast
          type="success"
          message={message}
          toastId={t.id}
          visible={t.visible}
        />
      ),
      { duration: 3000, ...options },
    ),

  error: (message, options = {}) =>
    toast.custom(
      (t) => (
        <CustomToast
          type="error"
          message={message}
          toastId={t.id}
          visible={t.visible}
        />
      ),
      { duration: 4000, ...options },
    ),

  info: (message, options = {}) =>
    toast.custom(
      (t) => (
        <CustomToast
          type="info"
          message={message}
          toastId={t.id}
          visible={t.visible}
        />
      ),
      { duration: 3000, ...options },
    ),

  warning: (message, options = {}) =>
    toast.custom(
      (t) => (
        <CustomToast
          type="warning"
          message={message}
          toastId={t.id}
          visible={t.visible}
        />
      ),
      { duration: 4000, ...options },
    ),
};

// ─── Toast configs ─────────────────────────────────────
const TOAST_STYLES = {
  success: {
    icon: <CheckCircle size={18} />,
    bg: "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800",
    text: "text-green-800 dark:text-green-200",
    icon_color: "text-green-500",
  },
  error: {
    icon: <XCircle size={18} />,
    bg: "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800",
    text: "text-red-800 dark:text-red-200",
    icon_color: "text-red-500",
  },
  info: {
    icon: <Info size={18} />,
    bg: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
    text: "text-blue-800 dark:text-blue-200",
    icon_color: "text-blue-500",
  },
  warning: {
    icon: <AlertCircle size={18} />,
    bg: "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800",
    text: "text-yellow-800 dark:text-yellow-200",
    icon_color: "text-yellow-500",
  },
};

// ─── Custom toast component ────────────────────────────
const CustomToast = ({ type, message, toastId, visible }) => {
  const style = TOAST_STYLES[type];

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg
        max-w-sm w-full pointer-events-auto
        ${style.bg}
        ${visible ? "animate-fade-up" : "animate-fade-out opacity-0"}
        transition-all duration-300
      `}
    >
      <span className={`flex-shrink-0 ${style.icon_color}`}>{style.icon}</span>
      <p className={`flex-1 text-sm font-medium ${style.text}`}>{message}</p>
      <button
        onClick={() => toast.dismiss(toastId)}
        className={`flex-shrink-0 ${style.text} opacity-60 hover:opacity-100 transition-opacity`}
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default CustomToast;
