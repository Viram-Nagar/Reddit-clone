import { create } from "zustand";
import { devtools } from "zustand/middleware";
import api from "../service/api.js";

const useUserStore = create(
  devtools(
    (set, get) => ({
      // ─── State ──────────────────────────────────
      profile: null,
      userPosts: [],
      userComments: [],
      isLoadingProfile: false,
      isLoadingPosts: false,
      isLoadingComments: false,
      isUpdating: false,
      postsTotal: 0,
      commentsTotal: 0,
      error: null,

      // ─── Actions ────────────────────────────────

      fetchProfile: async (username) => {
        set({ isLoadingProfile: true, error: null, profile: null });
        try {
          const { data } = await api.get(`/users/${username}`);
          set({ profile: data.user, isLoadingProfile: false });
        } catch (error) {
          set({
            error:
              error.response?.status === 404
                ? "User not found"
                : "Failed to load profile",
            isLoadingProfile: false,
          });
        }
      },

      fetchUserPosts: async (username, page = 1) => {
        set({ isLoadingPosts: true });
        try {
          const { data } = await api.get(
            `/users/${username}/posts?page=${page}&limit=10`,
          );
          set((state) => ({
            // Append for pagination, replace for fresh load
            userPosts:
              page === 1 ? data.posts : [...state.userPosts, ...data.posts],
            postsTotal: data.total,
            isLoadingPosts: false,
          }));
        } catch {
          set({ isLoadingPosts: false });
        }
      },

      fetchUserComments: async (username, page = 1) => {
        set({ isLoadingComments: true });
        try {
          const { data } = await api.get(
            `/users/${username}/comments?page=${page}&limit=10`,
          );
          set((state) => ({
            userComments:
              page === 1
                ? data.comments
                : [...state.userComments, ...data.comments],
            commentsTotal: data.total,
            isLoadingComments: false,
          }));
        } catch {
          set({ isLoadingComments: false });
        }
      },

      updateProfile: async (profileData) => {
        set({ isUpdating: true });
        try {
          const { data } = await api.patch("/users/me/profile", profileData);
          set((state) => ({
            profile: state.profile
              ? { ...state.profile, ...data.user }
              : data.user,
            isUpdating: false,
          }));
          return { success: true, user: data.user };
        } catch {
          set({ isUpdating: false });
          return { success: false };
        }
      },

      changePassword: async (currentPassword, newPassword) => {
        set({ isUpdating: true });
        try {
          await api.patch("/users/me/password", {
            currentPassword,
            newPassword,
          });
          set({ isUpdating: false });
          return { success: true };
        } catch (error) {
          set({ isUpdating: false });
          const errors = error.response?.data?.errors || [];
          return { success: false, errors };
        }
      },

      clearProfile: () =>
        set({
          profile: null,
          userPosts: [],
          userComments: [],
          error: null,
          postsTotal: 0,
          commentsTotal: 0,
        }),
    }),
    { name: "UserStore" },
  ),
);

export default useUserStore;
