import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import api from "../service/api.js";

const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        // ─── State ──────────────────────────────
        user: null,
        isLoading: false,
        isCheckingAuth: true,
        error: null,

        // ─── Actions ────────────────────────────

        // Check session on app load
        checkAuth: async () => {
          set({ isCheckingAuth: true });
          try {
            const { data } = await api.get("/auth/me");
            set({ user: data.user, isCheckingAuth: false });
          } catch {
            set({ user: null, isCheckingAuth: false });
          }
        },

        // Register
        register: async (email, username, password) => {
          set({ isLoading: true, error: null });
          try {
            const { data } = await api.post("/auth/register", {
              email,
              username,
              password,
            });
            set({ user: data.user, isLoading: false });
            return { success: true };
          } catch (error) {
            const errors = error.response?.data?.errors || [];
            set({ isLoading: false, error: errors });
            return { success: false, errors };
          }
        },

        // Login
        login: async (email, password) => {
          set({ isLoading: true, error: null });
          try {
            const { data } = await api.post("/auth/login", { email, password });
            set({ user: data.user, isLoading: false });
            return { success: true };
          } catch (error) {
            const errors = error.response?.data?.errors || [];
            set({ isLoading: false, error: errors });
            return { success: false, errors };
          }
        },

        // Logout
        logout: async () => {
          try {
            await api.post("/auth/logout");
          } finally {
            set({ user: null, error: null });
          }
        },

        // Clear errors
        clearError: () => set({ error: null }),
      }),
      {
        name: "auth-storage",
        // Only persist user info, not loading states
        partialize: (state) => ({ user: state.user }),
      },
    ),
    { name: "AuthStore" },
  ),
);

export default useAuthStore;
