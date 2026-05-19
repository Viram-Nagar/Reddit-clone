import { create } from "zustand";
import { devtools } from "zustand/middleware";
import api from "../service/api.js";

const useFeedStore = create(
  devtools(
    (set, get) => ({
      // ─── State ──────────────────────────────────
      posts: [],
      trendingCommunities: [],
      searchResults: { posts: [], communities: [] },

      // Pagination
      nextCursor: null,
      hasMore: false,
      total: 0,

      // UI
      sort: "hot",
      feedType: "home", // 'home' | 'following'
      isLoading: false,
      isLoadingMore: false,
      isSearching: false,
      isTrendingLoading: false,
      isEmpty: false, // following feed with no joined communities
      error: null,

      // ─── Actions ────────────────────────────────

      setSort: (sort) => {
        set({ sort, posts: [], nextCursor: null });
      },

      setFeedType: (feedType) => {
        set({ feedType, posts: [], nextCursor: null, hasMore: false });
      },

      // ── Initial load ───────────────────────────
      fetchFeed: async (sort, feedType) => {
        set({ isLoading: true, error: null, posts: [] });

        try {
          const endpoint =
            feedType === "following" ? "/feed/following" : "/feed/home";

          const { data } = await api.get(endpoint, {
            params: { sort, limit: 15 },
          });

          set({
            posts: data.posts,
            nextCursor: data.nextCursor,
            hasMore: data.hasMore,
            total: data.total || 0,
            isEmpty: data.isEmpty || false,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: "Failed to load feed",
            isLoading: false,
          });
        }
      },

      // ── Load next page (infinite scroll) ──────
      loadMore: async () => {
        const { nextCursor, sort, feedType, isLoadingMore, hasMore } = get();
        if (!hasMore || isLoadingMore) return;

        set({ isLoadingMore: true });

        try {
          const endpoint =
            feedType === "following" ? "/feed/following" : "/feed/home";

          const { data } = await api.get(endpoint, {
            params: { sort, limit: 15, cursor: nextCursor },
          });

          set((state) => ({
            posts: [...state.posts, ...data.posts],
            nextCursor: data.nextCursor,
            hasMore: data.hasMore,
            isLoadingMore: false,
          }));
        } catch {
          set({ isLoadingMore: false });
        }
      },

      // ── Trending communities ───────────────────
      fetchTrending: async () => {
        set({ isTrendingLoading: true });
        try {
          const { data } = await api.get("/feed/trending", {
            params: { limit: 6 },
          });
          set({
            trendingCommunities: data.communities,
            isTrendingLoading: false,
          });
        } catch {
          set({ isTrendingLoading: false });
        }
      },

      // ── Global search ──────────────────────────
      search: async (query) => {
        if (!query || query.length < 2) {
          set({ searchResults: { posts: [], communities: [] } });
          return;
        }

        set({ isSearching: true });
        try {
          const { data } = await api.get("/feed/search", {
            params: { q: query, limit: 5 },
          });
          set({ searchResults: data, isSearching: false });
        } catch {
          set({ isSearching: false });
        }
      },

      clearSearch: () => set({ searchResults: { posts: [], communities: [] } }),

      // Update a post vote in feed (called by voteStore)
      updatePostVote: (postId, voteScore, userVote) => {
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId ? { ...p, voteScore, userVote } : p,
          ),
        }));
      },
    }),
    { name: "FeedStore" },
  ),
);

export default useFeedStore;
