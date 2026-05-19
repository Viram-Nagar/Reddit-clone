import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare, Share2, Trash2 } from "lucide-react";
import usePostStore from "../store/postStore";
import useAuthStore from "../store/authStore";
import { VoteButtonsHorizontal } from "../components/posts/VoteButtons";
import { formatRelativeTime, formatFullDate } from "../utils/formatDate";
import { PostSkeleton } from "../components/ui/SkeletonLoader";
import toast from "react-hot-toast";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentPost, isLoading, error, fetchPost, deletePost } =
    usePostStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchPost(id);
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    const result = await deletePost(id);
    if (result.success) {
      toast.success("Post deleted");
      navigate(`/r/${currentPost.community.slug}`);
    } else {
      toast.error("Failed to delete post");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <PostSkeleton />
        <div className="mt-4 bg-white border border-gray-200 rounded-md h-48 animate-pulse" />
      </div>
    );
  }

  if (error || !currentPost) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-6xl">🔍</div>
        <h2 className="text-xl font-bold text-gray-700">Post not found</h2>
        <p className="text-gray-400 text-sm">
          This post may have been deleted or doesn't exist.
        </p>
        <button onClick={() => navigate(-1)} className="btn-primary">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Back */}
      <button
        onClick={() => navigate(`/r/${currentPost.community.slug}`)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to r/{currentPost.community.name}
      </button>

      {/* ── Post Card ──────────────────────────────── */}
      <div className="card mb-4 overflow-hidden">
        {/* Vote + Actions bar */}
        <div className="px-4 pt-3 pb-2 flex items-center gap-3 border-b border-gray-100 bg-gray-50">
          <VoteButtonsHorizontal post={currentPost} />

          <div className="flex items-center gap-1 flex-wrap">
            <button className="btn-ghost text-xs py-1 px-2">
              <MessageSquare size={13} />
              {currentPost._count.comments} Comments
            </button>
            <button
              onClick={handleShare}
              className="btn-ghost text-xs py-1 px-2"
            >
              <Share2 size={13} />
              Share
            </button>
            {user?.id === currentPost.author.id && (
              <button
                onClick={handleDelete}
                className="btn-ghost text-xs py-1 px-2 text-red-400 hover:text-red-500 hover:bg-red-50"
              >
                <Trash2 size={13} />
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Post Body */}
        <div className="p-4">
          {/* Meta */}
          <div className="flex items-center flex-wrap gap-1 text-xs text-gray-500 mb-3">
            <Link
              to={`/r/${currentPost.community.slug}`}
              className="font-bold text-gray-900 hover:underline"
            >
              r/{currentPost.community.name}
            </Link>
            <span>•</span>
            <span>Posted by</span>
            <Link
              to={`/u/${currentPost.author.username}`}
              className="hover:underline"
            >
              u/{currentPost.author.username}
            </Link>
            <span>•</span>
            <span title={formatFullDate(currentPost.createdAt)}>
              {formatRelativeTime(currentPost.createdAt)}
            </span>
            {currentPost.type !== "text" && (
              <span
                className={`ml-1 px-1.5 py-0.5 rounded text-xs font-medium ${
                  currentPost.type === "image"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {currentPost.type === "image" ? "🖼 Image" : "🔗 Link"}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold text-gray-900 mb-4 leading-snug">
            {currentPost.title}
          </h1>

          {/* Content */}
          {currentPost.type === "text" && currentPost.content && (
            <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {currentPost.content}
            </div>
          )}

          {currentPost.type === "image" && currentPost.imageUrl && (
            <img
              src={currentPost.imageUrl}
              alt={currentPost.title}
              className="max-w-full rounded"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}

          {currentPost.type === "link" && currentPost.imageUrl && (
            <a
              href={currentPost.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-reddit-blue hover:underline"
            >
              🔗 {currentPost.imageUrl}
            </a>
          )}
        </div>
      </div>

      {/* ── Comments Section ───────────────────────── */}
      <div className="card p-4">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare size={18} />
          {currentPost._count.comments}{" "}
          {currentPost._count.comments === 1 ? "Comment" : "Comments"}
        </h2>

        {/* Comment form placeholder — Day 6 */}
        {user ? (
          <div className="border border-dashed border-gray-300 rounded p-4 text-center text-sm text-gray-400 mb-4">
            💬 Full comment system coming Day 6!
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded p-4 text-center mb-4">
            <p className="text-sm text-gray-600 mb-3">
              Log in or sign up to leave a comment
            </p>
            <div className="flex justify-center gap-2">
              <Link to="/login">
                <button className="btn-secondary text-xs">Log In</button>
              </Link>
              <Link to="/register">
                <button className="btn-primary text-xs">Sign Up</button>
              </Link>
            </div>
          </div>
        )}

        {/* Existing comments (from seed data) */}
        {currentPost.comments?.length > 0 && (
          <div className="space-y-4">
            {currentPost.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                {/* Avatar */}
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-reddit-orange to-orange-400 flex-shrink-0 flex items-center justify-center mt-0.5">
                  <span className="text-white text-xs font-bold">
                    {comment.author.username[0].toUpperCase()}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      to={`/u/${comment.author.username}`}
                      className="text-xs font-bold text-gray-900 hover:underline"
                    >
                      u/{comment.author.username}
                    </Link>
                    <span className="text-xs text-gray-400">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
