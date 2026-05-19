import { create } from "zustand";
import { devtools } from "zustand/middleware";
import api from "../service/api.js";

const usePostStore = create(
  devtools(
    (set, get) => ({
      // ─── State ──────────────────────────────────
      posts: [],
      currentPost: null,
      isLoading: false,
      isSubmitting: false,
      error: null,
      sort: "new",

      // ─── Actions ────────────────────────────────

      setSort: (sort) => set({ sort }),

      fetchPosts: async (sort = "new") => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.get(`/posts?sort=${sort}`);
          set({ posts: data.posts, isLoading: false });
        } catch {
          set({ error: "Failed to load posts", isLoading: false });
        }
      },

      fetchPostsByCommunity: async (slug, sort = "new") => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.get(
            `/communities/${slug}/posts?sort=${sort}`,
          );
          set({ posts: data.posts, isLoading: false });
        } catch {
          set({ error: "Failed to load posts", isLoading: false });
        }
      },

      fetchPost: async (id) => {
        set({ isLoading: true, error: null, currentPost: null });
        try {
          const { data } = await api.get(`/posts/${id}`);
          set({ currentPost: data.post, isLoading: false });
        } catch {
          set({ error: "Post not found", isLoading: false });
        }
      },

      createPost: async (postData) => {
        set({ isSubmitting: true });
        try {
          const { data } = await api.post("/posts", postData);
          // Prepend new post to list
          set((state) => ({
            posts: [data.post, ...state.posts],
            isSubmitting: false,
          }));
          return { success: true, post: data.post };
        } catch (error) {
          const errors = error.response?.data?.errors || [];
          set({ isSubmitting: false });
          return { success: false, errors };
        }
      },

      deletePost: async (id) => {
        try {
          await api.delete(`/posts/${id}`);
          set((state) => ({
            posts: state.posts.filter((p) => p.id !== id),
            currentPost:
              state.currentPost?.id === id ? null : state.currentPost,
          }));
          return { success: true };
        } catch {
          return { success: false };
        }
      },

      // Called by vote store to update vote score in place
      updatePostVote: (postId, voteScore, userVote) => {
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId ? { ...p, voteScore, userVote } : p,
          ),
          currentPost:
            state.currentPost?.id === postId
              ? { ...state.currentPost, voteScore, userVote }
              : state.currentPost,
        }));
      },

      // Called by commentStore to keep comment count in sync
      updateCommentCount: (postId, count) => {
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId
              ? { ...p, _count: { ...p._count, comments: count } }
              : p,
          ),
          currentPost:
            state.currentPost?.id === postId
              ? {
                  ...state.currentPost,
                  _count: { ...state.currentPost._count, comments: count },
                }
              : state.currentPost,
        }));
      },
    }),
    { name: "PostStore" },
  ),
);

export default usePostStore;
