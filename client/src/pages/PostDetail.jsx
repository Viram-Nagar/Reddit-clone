import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare, Share2, Trash2 } from "lucide-react";
import usePostStore from "../store/postStore";
import useAuthStore from "../store/authStore";
import useCommentStore from "../store/commentStore";
import { VoteButtonsHorizontal } from "../components/posts/VoteButtons";
import { NewCommentForm } from "../components/comments/CommentForm";
import CommentList from "../components/comments/CommentList";
import { formatRelativeTime, formatFullDate } from "../utils/formatDate";
import { PostSkeleton } from "../components/ui/SkeletonLoader";
import toast from "react-hot-toast";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    currentPost,
    isLoading: postLoading,
    error,
    fetchPost,
    deletePost,
  } = usePostStore();
  const {
    comments,
    isLoading: commentsLoading,
    fetchComments,
    clearComments,
  } = useCommentStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchPost(id);
    fetchComments(id);

    // Cleanup on unmount
    return () => clearComments();
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

  // ── Loading State ────────────────────────────────────
  if (postLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <PostSkeleton />
        <div className="bg-white border border-gray-200 rounded-md p-4 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-7 h-7 rounded-full bg-gray-200 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 bg-gray-200 rounded" />
                <div className="h-3 w-full bg-gray-200 rounded" />
                <div className="h-3 w-2/3 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Not Found ────────────────────────────────────────
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
      {/* ── Back Button ─────────────────────────────── */}
      <button
        onClick={() => navigate(`/r/${currentPost.community.slug}`)}
        className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to r/{currentPost.community.name}
      </button>

      {/* ── Post Card ──────────────────────────────── */}
      <div className="card mb-4 overflow-hidden">
        {/* Vote + Action bar */}
        <div className="px-4 pt-3 pb-2 flex items-center gap-3 flex-wrap border-b border-gray-100 bg-gray-50">
          <VoteButtonsHorizontal post={currentPost} />

          <div className="flex items-center gap-1 flex-wrap">
            <button className="btn-ghost text-xs py-1 px-2">
              <MessageSquare size={13} />
              {currentPost._count.comments}{" "}
              {currentPost._count.comments === 1 ? "Comment" : "Comments"}
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

        {/* Post body */}
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

          {/* Body */}
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
        {/* Section header */}
        <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <MessageSquare size={18} />
          {currentPost._count.comments}{" "}
          {currentPost._count.comments === 1 ? "Comment" : "Comments"}
        </h2>

        {/* New comment form */}
        <NewCommentForm postId={id} />

        {/* Comment list */}
        <CommentList
          comments={comments}
          postId={id}
          isLoading={commentsLoading}
        />
      </div>
    </div>
  );
};

export default PostDetail;

// import { useEffect } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   ArrowUp,
//   ArrowDown,
//   MessageSquare,
//   Share2,
//   Trash2,
// } from "lucide-react";
// import usePostStore from "../store/postStore";
// import useAuthStore from "../store/authStore";
// import { formatRelativeTime, formatFullDate } from "../utils/formatDate";
// import { PostSkeleton } from "../components/ui/SkeletonLoader";
// import toast from "react-hot-toast";
// import api from "../services/api";

// const PostDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const {
//     currentPost,
//     isLoading,
//     error,
//     fetchPost,
//     deletePost,
//     updatePostVote,
//   } = usePostStore();
//   const { user } = useAuthStore();

//   useEffect(() => {
//     fetchPost(id);
//   }, [id]);

//   const handleVote = async (type) => {
//     if (!user) {
//       toast.error("Login to vote");
//       navigate("/login");
//       return;
//     }

//     const previousScore = currentPost.voteScore;
//     const previousVote = currentPost.userVote;

//     let newScore = previousScore;
//     let newVote = type;

//     if (previousVote === type) {
//       newScore = type === "UP" ? previousScore - 1 : previousScore + 1;
//       newVote = null;
//     } else if (!previousVote) {
//       newScore = type === "UP" ? previousScore + 1 : previousScore - 1;
//     } else {
//       newScore = type === "UP" ? previousScore + 2 : previousScore - 2;
//     }

//     updatePostVote(id, newScore, newVote);

//     try {
//       const { data } = await api.post(`/posts/${id}/vote`, { type });
//       updatePostVote(id, data.voteScore, data.userVote);
//     } catch {
//       updatePostVote(id, previousScore, previousVote);
//       toast.error("Failed to vote");
//     }
//   };

//   const handleDelete = async () => {
//     if (!window.confirm("Delete this post?")) return;
//     const result = await deletePost(id);
//     if (result.success) {
//       toast.success("Post deleted");
//       navigate(`/r/${currentPost.community.slug}`);
//     }
//   };

//   const handleShare = () => {
//     navigator.clipboard.writeText(window.location.href);
//     toast.success("Link copied!");
//   };

//   if (isLoading) {
//     return (
//       <div className="max-w-3xl mx-auto px-4 py-6">
//         <PostSkeleton />
//       </div>
//     );
//   }

//   if (error || !currentPost) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
//         <div className="text-6xl">🔍</div>
//         <h2 className="text-xl font-bold text-gray-700">Post not found</h2>
//         <button onClick={() => navigate(-1)} className="btn-primary">
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-3xl mx-auto px-4 py-6">
//       {/* Back Button */}
//       <button
//         onClick={() => navigate(`/r/${currentPost.community.slug}`)}
//         className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
//       >
//         <ArrowLeft size={16} />
//         Back to r/{currentPost.community.name}
//       </button>

//       {/* Post Card */}
//       <div className="card flex mb-4">
//         {/* Vote Column */}
//         <div className="w-10 bg-gray-50 flex flex-col items-center py-3 gap-1 rounded-l-md flex-shrink-0">
//           <button
//             onClick={() => handleVote("UP")}
//             className={`p-1 rounded hover:bg-gray-200 ${
//               currentPost.userVote === "UP"
//                 ? "text-reddit-orange"
//                 : "text-gray-400"
//             }`}
//           >
//             <ArrowUp
//               size={20}
//               strokeWidth={currentPost.userVote === "UP" ? 2.5 : 1.5}
//             />
//           </button>
//           <span
//             className={`text-sm font-bold ${
//               currentPost.userVote === "UP"
//                 ? "text-reddit-orange"
//                 : currentPost.userVote === "DOWN"
//                   ? "text-reddit-blue"
//                   : "text-gray-700"
//             }`}
//           >
//             {currentPost.voteScore}
//           </span>
//           <button
//             onClick={() => handleVote("DOWN")}
//             className={`p-1 rounded hover:bg-gray-200 ${
//               currentPost.userVote === "DOWN"
//                 ? "text-reddit-blue"
//                 : "text-gray-400"
//             }`}
//           >
//             <ArrowDown
//               size={20}
//               strokeWidth={currentPost.userVote === "DOWN" ? 2.5 : 1.5}
//             />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="flex-1 p-4">
//           {/* Meta */}
//           <div className="flex items-center flex-wrap gap-1 text-xs text-gray-500 mb-3">
//             <Link
//               to={`/r/${currentPost.community.slug}`}
//               className="font-bold text-gray-900 hover:underline"
//             >
//               r/{currentPost.community.name}
//             </Link>
//             <span>•</span>
//             <span>Posted by</span>
//             <Link
//               to={`/u/${currentPost.author.username}`}
//               className="hover:underline"
//             >
//               u/{currentPost.author.username}
//             </Link>
//             <span>•</span>
//             <span title={formatFullDate(currentPost.createdAt)}>
//               {formatRelativeTime(currentPost.createdAt)}
//             </span>
//           </div>

//           {/* Title */}
//           <h1 className="text-xl font-bold text-gray-900 mb-3">
//             {currentPost.title}
//           </h1>

//           {/* Body */}
//           {currentPost.type === "text" && currentPost.content && (
//             <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap mb-4">
//               {currentPost.content}
//             </div>
//           )}

//           {currentPost.type === "image" && currentPost.imageUrl && (
//             <img
//               src={currentPost.imageUrl}
//               alt={currentPost.title}
//               className="max-w-full rounded mb-4"
//             />
//           )}

//           {currentPost.type === "link" && currentPost.imageUrl && (
//             <a
//               href={currentPost.imageUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center gap-1 text-sm text-reddit-blue hover:underline mb-4"
//             >
//               🔗 {currentPost.imageUrl}
//             </a>
//           )}

//           {/* Actions */}
//           <div className="flex items-center gap-2 flex-wrap">
//             <button className="btn-ghost text-xs">
//               <MessageSquare size={14} />
//               {currentPost._count.comments} Comments
//             </button>
//             <button onClick={handleShare} className="btn-ghost text-xs">
//               <Share2 size={14} />
//               Share
//             </button>
//             {user?.id === currentPost.author.id && (
//               <button
//                 onClick={handleDelete}
//                 className="btn-ghost text-xs text-red-400 hover:text-red-500 hover:bg-red-50"
//               >
//                 <Trash2 size={14} />
//                 Delete
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Comments Section — placeholder until Day 6 */}
//       <div className="card p-6">
//         <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
//           <MessageSquare size={18} />
//           {currentPost._count.comments} Comments
//         </h2>

//         {user ? (
//           <div className="bg-gray-50 border border-gray-200 rounded p-4 text-center text-sm text-gray-400">
//             💬 Comment system coming Day 6!
//           </div>
//         ) : (
//           <div className="bg-gray-50 border border-gray-200 rounded p-4 text-center">
//             <p className="text-sm text-gray-600 mb-2">
//               Log in or sign up to leave a comment
//             </p>
//             <div className="flex justify-center gap-2">
//               <Link to="/login">
//                 <button className="btn-secondary text-xs">Log In</button>
//               </Link>
//               <Link to="/register">
//                 <button className="btn-primary text-xs">Sign Up</button>
//               </Link>
//             </div>
//           </div>
//         )}

//         {/* Show existing comments from seed data */}
//         {currentPost.comments?.length > 0 && (
//           <div className="mt-4 space-y-4">
//             {currentPost.comments.map((comment) => (
//               <div key={comment.id} className="border-l-2 border-gray-200 pl-4">
//                 <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
//                   <Link
//                     to={`/u/${comment.author.username}`}
//                     className="font-bold text-gray-900 hover:underline"
//                   >
//                     u/{comment.author.username}
//                   </Link>
//                   <span>•</span>
//                   <span>{formatRelativeTime(comment.createdAt)}</span>
//                 </div>
//                 <p className="text-sm text-gray-700">{comment.content}</p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PostDetail;
