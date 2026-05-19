import CommentCard from "./CommentCard";

// ─── Skeleton ────────────────────────────────────────
const CommentSkeleton = () => (
  <div className="flex gap-3 animate-pulse">
    <div className="w-7 h-7 rounded-full bg-gray-200 flex-shrink-0" />
    <div className="flex-1 space-y-2 pb-4">
      <div className="h-3 w-24 bg-gray-200 rounded" />
      <div className="h-3 w-full bg-gray-200 rounded" />
      <div className="h-3 w-3/4 bg-gray-200 rounded" />
    </div>
  </div>
);

// ─── Comment List ─────────────────────────────────────
const CommentList = ({ comments, postId, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-1 mt-4">
        {[...Array(3)].map((_, i) => (
          <CommentSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!comments.length) {
    return (
      <div className="text-center py-10">
        <div className="text-4xl mb-3">💭</div>
        <p className="text-gray-500 font-medium">No comments yet</p>
        <p className="text-gray-400 text-sm mt-1">
          Be the first to share your thoughts!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1 mt-2">
      {/* Comment count header */}
      <p className="text-xs text-gray-500 mb-3">
        Showing {comments.length}{" "}
        {comments.length === 1 ? "comment" : "comments"}
      </p>

      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} postId={postId} />
      ))}
    </div>
  );
};

export default CommentList;
