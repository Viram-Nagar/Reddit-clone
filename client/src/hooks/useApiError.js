import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";
import api from "../service/api.js";

// Global API error handler hook
// Mount this once in App.jsx to handle auth errors app-wide
const useApiError = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Add response interceptor
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        switch (status) {
          case 401:
            // Token expired or invalid — log user out
            logout();
            navigate("/login");
            toast.error("Your session expired. Please log in again.");
            break;

          case 403:
            toast.error(message || "You don't have permission for this action");
            break;

          case 429:
            toast.error(message || "Too many requests. Please slow down.", {
              duration: 5000,
            });
            break;

          case 500:
            toast.error("Server error. Please try again later.", {
              duration: 5000,
            });
            break;

          case undefined:
            // Network error (no response)
            if (!error.response) {
              toast.error("Network error. Check your connection.", {
                id: "network-error", // Prevent duplicate toasts
              });
            }
            break;

          default:
            break;
        }

        return Promise.reject(error);
      },
    );

    // Cleanup interceptor on unmount
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [logout, navigate]);
};

export default useApiError;
