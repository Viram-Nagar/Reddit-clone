import { Link } from "react-router-dom";
import { Trash2, Pencil, Flag } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";
import useCommentStore from "../../store/commentStore";
import { EditCommentForm } from "./CommentForm";
import { formatRelativeTime } from "../../utils/formatDate";

const CommentCard = ({ comment, postId }) => {
  const { user } = useAuthStore();
  const { deleteComment, startEditing, editingId } = useCommentStore();
  const [showActions, setShowActions] = useState(false);

  const isEditing = editingId === comment.id;
  const isAuthor = user?.id === comment.author.id;

  const handleDelete = async () => {
    if (!window.confirm("Delete this comment?")) return;
    const result = await deleteComment(comment.id, postId);
    if (result.success) toast.success("Comment deleted");
    else toast.error("Failed to delete comment");
  };

  return (
    <div
      className="flex gap-3 group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* ── Avatar ──────────────────────────────── */}
      <div className="flex flex-col items-center flex-shrink-0">
        <Link to={`/u/${comment.author.username}`}>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-reddit-orange to-orange-400 flex items-center justify-center hover:ring-2 hover:ring-reddit-orange transition-all">
            {comment.author.avatar ? (
              <img
                src={comment.author.avatar}
                alt={comment.author.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-xs font-bold">
                {comment.author.username[0].toUpperCase()}
              </span>
            )}
          </div>
        </Link>

        {/* Thread line */}
        <div className="w-0.5 bg-gray-200 flex-1 mt-1.5 group-hover:bg-gray-300 transition-colors min-h-[8px]" />
      </div>

      {/* ── Comment Body ─────────────────────────── */}
      <div className="flex-1 pb-3 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <Link
            to={`/u/${comment.author.username}`}
            className="text-xs font-bold text-gray-900 hover:underline"
          >
            u/{comment.author.username}
          </Link>
          <span className="text-xs text-gray-400">
            {formatRelativeTime(comment.createdAt)}
          </span>
          {comment.createdAt !== comment.updatedAt && (
            <span className="text-xs text-gray-400 italic">(edited)</span>
          )}
        </div>

        {/* Content or Edit form */}
        {isEditing ? (
          <EditCommentForm comment={comment} />
        ) : (
          <>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>

            {/* Action bar — visible on hover or for touch devices */}
            <div
              className={`flex items-center gap-1 mt-1.5 transition-opacity ${
                showActions ? "opacity-100" : "opacity-0"
              }`}
            >
              {isAuthor && (
                <>
                  <button
                    onClick={() => startEditing(comment.id)}
                    className="btn-ghost text-xs py-0.5 px-2 text-gray-400 hover:text-gray-700"
                  >
                    <Pencil size={12} />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="btn-ghost text-xs py-0.5 px-2 text-gray-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </>
              )}
              {!isAuthor && user && (
                <button className="btn-ghost text-xs py-0.5 px-2 text-gray-400 hover:text-gray-700">
                  <Flag size={12} />
                  Report
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
