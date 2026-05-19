import { create } from "zustand";
import { devtools } from "zustand/middleware";
import api from "../service/api.js";
import usePostStore from "./postStore";

const useCommentStore = create(
  devtools(
    (set, get) => ({
      // ─── State ──────────────────────────────────
      comments: [],
      isLoading: false,
      isSubmitting: false,
      editingId: null, // which comment is being edited
      error: null,

      // ─── Actions ────────────────────────────────

      fetchComments: async (postId) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.get(`/comments/post/${postId}`);
          set({ comments: data.comments, isLoading: false });
        } catch {
          set({ error: "Failed to load comments", isLoading: false });
        }
      },

      addComment: async (postId, content) => {
        set({ isSubmitting: true });
        try {
          const { data } = await api.post(`/comments/post/${postId}`, {
            content,
          });

          // Prepend new comment to list (newest first)
          set((state) => ({
            comments: [data.comment, ...state.comments],
            isSubmitting: false,
          }));

          // Sync comment count on the post in postStore
          usePostStore.getState().updateCommentCount(postId, data.commentCount);

          return { success: true, comment: data.comment };
        } catch (error) {
          set({ isSubmitting: false });
          return { success: false };
        }
      },

      deleteComment: async (commentId, postId) => {
        // Optimistic: remove from list immediately
        const previous = get().comments;
        set((state) => ({
          comments: state.comments.filter((c) => c.id !== commentId),
        }));

        try {
          const { data } = await api.delete(`/comments/${commentId}`);

          // Sync count
          usePostStore.getState().updateCommentCount(postId, data.commentCount);

          return { success: true };
        } catch {
          // Rollback
          set({ comments: previous });
          return { success: false };
        }
      },

      // Enter edit mode for a comment
      startEditing: (commentId) => set({ editingId: commentId }),
      cancelEditing: () => set({ editingId: null }),

      editComment: async (commentId, content) => {
        set({ isSubmitting: true });
        try {
          const { data } = await api.patch(`/comments/${commentId}`, {
            content,
          });

          set((state) => ({
            comments: state.comments.map((c) =>
              c.id === commentId ? data.comment : c,
            ),
            isSubmitting: false,
            editingId: null,
          }));

          return { success: true };
        } catch {
          set({ isSubmitting: false });
          return { success: false };
        }
      },

      clearComments: () => set({ comments: [], editingId: null }),
    }),
    { name: "CommentStore" },
  ),
);

export default useCommentStore;
