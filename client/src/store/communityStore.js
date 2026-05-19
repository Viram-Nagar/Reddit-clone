import { create } from "zustand";
import { devtools } from "zustand/middleware";
import api from "../service/api";

const useCommunityStore = create(
  devtools(
    (set, get) => ({
      // ─── State ──────────────────────────────────
      communities: [],
      currentCommunity: null,
      isMember: false,
      isLoading: false,
      isJoining: false,
      error: null,

      // ─── Actions ────────────────────────────────

      fetchAllCommunities: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.get("/communities");
          set({ communities: data.communities, isLoading: false });
        } catch (error) {
          set({ error: "Failed to load communities", isLoading: false });
        }
      },

      fetchCommunity: async (slug) => {
        set({ isLoading: true, error: null, currentCommunity: null });
        try {
          const { data } = await api.get(`/communities/${slug}`);
          set({ currentCommunity: data.community, isLoading: false });
        } catch (error) {
          set({ error: "Community not found", isLoading: false });
        }
      },

      createCommunity: async (name, description) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post("/communities", {
            name,
            description,
          });
          // Add new community to list
          set((state) => ({
            communities: [data.community, ...state.communities],
            isLoading: false,
          }));
          return { success: true, community: data.community };
        } catch (error) {
          const errors = error.response?.data?.errors || [];
          set({ isLoading: false });
          return { success: false, errors };
        }
      },

      checkMembership: async (slug) => {
        try {
          const { data } = await api.get(`/communities/${slug}/membership`);
          set({ isMember: data.isMember });
        } catch {
          set({ isMember: false });
        }
      },

      toggleJoin: async (slug) => {
        set({ isJoining: true });
        try {
          const { data } = await api.post(`/communities/${slug}/join`);
          set((state) => ({
            isMember: data.joined,
            isJoining: false,
            // Update member count in currentCommunity
            currentCommunity: state.currentCommunity
              ? {
                  ...state.currentCommunity,
                  _count: {
                    ...state.currentCommunity._count,
                    members: data.joined
                      ? state.currentCommunity._count.members + 1
                      : state.currentCommunity._count.members - 1,
                  },
                }
              : null,
          }));
          return { success: true, joined: data.joined };
        } catch (error) {
          set({ isJoining: false });
          return { success: false };
        }
      },
    }),
    { name: "CommunityStore" },
  ),
);

export default useCommunityStore;
