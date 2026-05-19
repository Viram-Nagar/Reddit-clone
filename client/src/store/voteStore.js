import { create } from "zustand";
import { devtools } from "zustand/middleware";
import api from "../service/api.js";
import usePostStore from "./postStore";
import useFeedStore from "./feedStore";

const useVoteStore = create(
  devtools(
    (set, get) => ({
      votingPosts: {},

      vote: async (postId, type, currentVoteScore, currentUserVote) => {
        const { votingPosts } = get();
        if (votingPosts[postId]) return;

        // ── Optimistic score ───────────────────────
        let optimisticScore = currentVoteScore;
        let optimisticVote = type;

        if (currentUserVote === type) {
          optimisticScore =
            type === "UP" ? currentVoteScore - 1 : currentVoteScore + 1;
          optimisticVote = null;
        } else if (currentUserVote === null) {
          optimisticScore =
            type === "UP" ? currentVoteScore + 1 : currentVoteScore - 1;
        } else {
          optimisticScore =
            type === "UP" ? currentVoteScore + 2 : currentVoteScore - 2;
        }

        // ── Lock post ──────────────────────────────
        set((state) => ({
          votingPosts: { ...state.votingPosts, [postId]: true },
        }));

        // ── Optimistic UI update (both stores) ────
        usePostStore
          .getState()
          .updatePostVote(postId, optimisticScore, optimisticVote);
        useFeedStore
          .getState()
          .updatePostVote(postId, optimisticScore, optimisticVote);

        // ── API call ───────────────────────────────
        try {
          const { data } = await api.post(`/votes/${postId}`, { type });

          // ── Sync with real server data ─────────
          usePostStore
            .getState()
            .updatePostVote(postId, data.voteScore, data.userVote);
          useFeedStore
            .getState()
            .updatePostVote(postId, data.voteScore, data.userVote);
        } catch (error) {
          // ── Rollback ───────────────────────────
          usePostStore
            .getState()
            .updatePostVote(postId, currentVoteScore, currentUserVote);
          useFeedStore
            .getState()
            .updatePostVote(postId, currentVoteScore, currentUserVote);
          throw error;
        } finally {
          set((state) => {
            const { [postId]: _, ...rest } = state.votingPosts;
            return { votingPosts: rest };
          });
        }
      },

      isVoting: (postId) => !!get().votingPosts[postId],
    }),
    { name: "VoteStore" },
  ),
);

export default useVoteStore;

// import { create } from "zustand";
// import { devtools } from "zustand/middleware";
// import api from "../services/api";
// import usePostStore from "./postStore";

// const useVoteStore = create(
//   devtools(
//     (set, get) => ({
//       // ─── State ──────────────────────────────────
//       // Track which posts are currently being voted on
//       // to prevent double-clicks
//       votingPosts: {}, // { [postId]: true }

//       // ─── Actions ────────────────────────────────

//       vote: async (postId, type, currentVoteScore, currentUserVote) => {
//         // Prevent double voting while request is in flight
//         const { votingPosts } = get();
//         if (votingPosts[postId]) return;

//         // ── Step 1: Optimistic UI calculation ─────
//         let optimisticScore = currentVoteScore;
//         let optimisticVote = type;

//         if (currentUserVote === type) {
//           // Toggle OFF: undo the vote
//           optimisticScore =
//             type === "UP" ? currentVoteScore - 1 : currentVoteScore + 1;
//           optimisticVote = null;
//         } else if (currentUserVote === null) {
//           // New vote
//           optimisticScore =
//             type === "UP" ? currentVoteScore + 1 : currentVoteScore - 1;
//         } else {
//           // Switch vote (UP→DOWN or DOWN→UP): score changes by 2
//           optimisticScore =
//             type === "UP" ? currentVoteScore + 2 : currentVoteScore - 2;
//         }

//         // ── Step 2: Update UI immediately ─────────
//         set((state) => ({
//           votingPosts: { ...state.votingPosts, [postId]: true },
//         }));

//         // Update post in postStore immediately
//         usePostStore
//           .getState()
//           .updatePostVote(postId, optimisticScore, optimisticVote);

//         // ── Step 3: Fire API call ──────────────────
//         try {
//           const { data } = await api.post(`/votes/${postId}`, { type });

//           // ── Step 4: Update with real server data ──
//           usePostStore
//             .getState()
//             .updatePostVote(postId, data.voteScore, data.userVote);
//         } catch (error) {
//           // ── Step 5: Rollback on failure ───────────
//           usePostStore
//             .getState()
//             .updatePostVote(postId, currentVoteScore, currentUserVote);

//           throw error; // Let the component handle the toast
//         } finally {
//           // Always unlock this post for voting
//           set((state) => {
//             const { [postId]: _, ...rest } = state.votingPosts;
//             return { votingPosts: rest };
//           });
//         }
//       },

//       isVoting: (postId) => {
//         return !!get().votingPosts[postId];
//       },
//     }),
//     { name: "VoteStore" },
//   ),
// );

// export default useVoteStore;
