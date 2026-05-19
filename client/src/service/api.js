import axios from "axios";

const baseURL = import.meta.env.PROD
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 10000, // 10 second timeout
});

// ─── Request interceptor ──────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Add request timestamp for debugging
    config.metadata = { startTime: Date.now() };
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response interceptor ─────────────────────────────
api.interceptors.response.use(
  (response) => {
    // Log response time in dev
    if (import.meta.env.DEV) {
      const duration = Date.now() - response.config.metadata?.startTime;
      console.debug(
        `✅ ${response.config.method?.toUpperCase()} ${response.config.url} — ${duration}ms`,
      );
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Retry once on network timeout (not on auth errors)
    if (error.code === "ECONNABORTED" && !originalRequest._retry) {
      originalRequest._retry = true;
      return api(originalRequest);
    }

    return Promise.reject(error);
  },
);

export default api;

// import axios from "axios";

// const api = axios.create({
//   baseURL: "/api",
//   withCredentials: true, // Send cookies with every request
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Response interceptor - handle auth errors globally
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Will handle redirect in AuthContext
//       window.dispatchEvent(new Event("unauthorized"));
//     }
//     return Promise.reject(error);
//   },
// );

// export default api;
