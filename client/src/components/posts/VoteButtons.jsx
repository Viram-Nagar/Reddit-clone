import { ArrowUp, ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useVoteStore from "../../store/voteStore";
import useAuthStore from "../../store/authStore";

// ─── Vertical layout (used in PostCard list) ──────────
export const VoteButtonsVertical = ({ post }) => {
  const { user } = useAuthStore();
  const { vote, isVoting } = useVoteStore();
  const navigate = useNavigate();

  const handleVote = async (e, type) => {
    e.preventDefault(); // Don't navigate if inside a Link
    e.stopPropagation();

    if (!user) {
      toast.error("Login to vote");
      navigate("/login");
      return;
    }

    if (isVoting(post.id)) return;

    try {
      await vote(post.id, type, post.voteScore, post.userVote);
    } catch {
      toast.error("Failed to vote. Try again.");
    }
  };

  const scoreColor =
    post.userVote === "UP"
      ? "text-reddit-orange"
      : post.userVote === "DOWN"
        ? "text-reddit-blue"
        : "text-gray-700";

  return (
    <div className="flex flex-col items-center py-2 gap-0.5">
      {/* Upvote */}
      <button
        onClick={(e) => handleVote(e, "UP")}
        disabled={isVoting(post.id)}
        aria-label="Upvote"
        className={`p-1 rounded hover:bg-orange-100 transition-colors group disabled:opacity-50 ${
          post.userVote === "UP"
            ? "text-reddit-orange"
            : "text-gray-400 hover:text-reddit-orange"
        }`}
      >
        <ArrowUp
          size={18}
          strokeWidth={post.userVote === "UP" ? 2.5 : 1.5}
          className={`transition-transform group-hover:scale-110 ${
            isVoting(post.id) ? "animate-pulse" : ""
          }`}
        />
      </button>

      {/* Score */}
      <span
        className={`text-xs font-bold ${scoreColor} min-w-[20px] text-center`}
      >
        {formatScore(post.voteScore)}
      </span>

      {/* Downvote */}
      <button
        onClick={(e) => handleVote(e, "DOWN")}
        disabled={isVoting(post.id)}
        aria-label="Downvote"
        className={`p-1 rounded hover:bg-blue-100 transition-colors group disabled:opacity-50 ${
          post.userVote === "DOWN"
            ? "text-reddit-blue"
            : "text-gray-400 hover:text-reddit-blue"
        }`}
      >
        <ArrowDown
          size={18}
          strokeWidth={post.userVote === "DOWN" ? 2.5 : 1.5}
          className={`transition-transform group-hover:scale-110 ${
            isVoting(post.id) ? "animate-pulse" : ""
          }`}
        />
      </button>
    </div>
  );
};

// ─── Horizontal layout (used in PostDetail) ───────────
export const VoteButtonsHorizontal = ({ post }) => {
  const { user } = useAuthStore();
  const { vote, isVoting } = useVoteStore();
  const navigate = useNavigate();

  const handleVote = async (type) => {
    if (!user) {
      toast.error("Login to vote");
      navigate("/login");
      return;
    }

    if (isVoting(post.id)) return;

    try {
      await vote(post.id, type, post.voteScore, post.userVote);
    } catch {
      toast.error("Failed to vote. Try again.");
    }
  };

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1">
      <button
        onClick={() => handleVote("UP")}
        disabled={isVoting(post.id)}
        aria-label="Upvote"
        className={`p-1 rounded-full hover:bg-orange-100 transition-colors disabled:opacity-50 ${
          post.userVote === "UP"
            ? "text-reddit-orange"
            : "text-gray-500 hover:text-reddit-orange"
        }`}
      >
        <ArrowUp size={20} strokeWidth={post.userVote === "UP" ? 2.5 : 1.5} />
      </button>

      <span
        className={`text-sm font-bold px-1 min-w-[28px] text-center ${
          post.userVote === "UP"
            ? "text-reddit-orange"
            : post.userVote === "DOWN"
              ? "text-reddit-blue"
              : "text-gray-800"
        }`}
      >
        {formatScore(post.voteScore)}
      </span>

      <button
        onClick={() => handleVote("DOWN")}
        disabled={isVoting(post.id)}
        aria-label="Downvote"
        className={`p-1 rounded-full hover:bg-blue-100 transition-colors disabled:opacity-50 ${
          post.userVote === "DOWN"
            ? "text-reddit-blue"
            : "text-gray-500 hover:text-reddit-blue"
        }`}
      >
        <ArrowDown
          size={20}
          strokeWidth={post.userVote === "DOWN" ? 2.5 : 1.5}
        />
      </button>
    </div>
  );
};

// ─── Helper ───────────────────────────────────────────
const formatScore = (score) => {
  if (score > 999) return `${(score / 1000).toFixed(1)}k`;
  if (score < -999) return `-${(Math.abs(score) / 1000).toFixed(1)}k`;
  return score.toString();
};
