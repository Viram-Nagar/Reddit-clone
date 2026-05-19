import { Link, useNavigate } from "react-router-dom";
import { MessageSquare, Share2, Trash2 } from "lucide-react";
import { formatRelativeTime } from "../../utils/formatDate";
import { VoteButtonsVertical } from "./VoteButtons";
import useAuthStore from "../../store/authStore";
import usePostStore from "../../store/postStore";
import toast from "react-hot-toast";

const PostCard = ({ post, showCommunity = true }) => {
  const { user } = useAuthStore();
  const { deletePost } = usePostStore();
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Delete this post?")) return;
    const result = await deletePost(post.id);
    if (result.success) toast.success("Post deleted");
    else toast.error("Failed to delete post");
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
    toast.success("Link copied!");
  };

  return (
    <div className="card-hover flex group animate-[fadeIn_0.2s_ease-out]">
      {/* ── Vote Column ─────────────────────────── */}
      <div className="w-10 dark:bg-gray-800/50 bg-gray-50 rounded-l-md flex-shrink-0 group-hover:bg-gray-100 transition-colors">
        <VoteButtonsVertical post={post} />
      </div>

      {/* ── Post Content ────────────────────────── */}
      <div className="flex-1 p-3 min-w-0">
        {/* Meta line */}
        <div className="flex items-center flex-wrap gap-1 text-xs text-gray-500 dark:text-gray-400 mb-1.5">
          {showCommunity && (
            <>
              <Link
                to={`/r/${post.community.slug}`}
                className="font-bold text-gray-900 hover:underline dark:text-gray-100"
                onClick={(e) => e.stopPropagation()}
              >
                r/{post.community.name}
              </Link>
              <span>•</span>
            </>
          )}
          <span>Posted by</span>
          <Link
            to={`/u/${post.author.username}`}
            className="hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            u/{post.author.username}
          </Link>
          <span>•</span>
          <span title={post.createdAt}>
            {formatRelativeTime(post.createdAt)}
          </span>

          {/* Post type badge */}
          {post.type !== "text" && (
            <span
              className={`ml-1 px-1.5 py-0.5 rounded text-xs font-medium ${
                post.type === "image"
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {post.type === "image" ? "🖼 Image" : "🔗 Link"}
            </span>
          )}
        </div>

        {/* Title */}
        <Link to={`/post/${post.id}`}>
          <h3 className="font-semibold dark:text-gray-100 text-gray-900 text-sm leading-snug hover:text-reddit-orange transition-colors line-clamp-3 mb-1.5">
            {post.title}
          </h3>
        </Link>

        {/* Content preview */}
        {post.type === "text" && post.content && (
          <p className="text-xs text-gray-500 line-clamp-2 dark:text-gray-400 leading-relaxed mb-2">
            {post.content}
          </p>
        )}

        {post.type === "image" && post.imageUrl && (
          <Link to={`/post/${post.id}`}>
            <img
              src={post.imageUrl}
              alt={post.title}
              className="mt-1 mb-2 max-h-72 w-full object-cover rounded"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </Link>
        )}

        {post.type === "link" && post.imageUrl && (
          <a
            href={post.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-reddit-blue hover:underline mb-2"
            onClick={(e) => e.stopPropagation()}
          >
            🔗 <span className="truncate max-w-xs">{post.imageUrl}</span>
          </a>
        )}

        {/* Action bar */}
        <div className="flex items-center gap-0.5 mt-1 flex-wrap">
          <Link to={`/post/${post.id}`}>
            <button className="btn-ghost text-xs py-1 px-2">
              <MessageSquare size={13} />
              {post._count.comments}{" "}
              {post._count.comments === 1 ? "Comment" : "Comments"}
            </button>
          </Link>

          <button onClick={handleShare} className="btn-ghost text-xs py-1 px-2">
            <Share2 size={13} />
            Share
          </button>

          {user?.id === post.author.id && (
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
    </div>
  );
};

export default PostCard;

// import { Link, useNavigate } from "react-router-dom";
// import {
//   MessageSquare,
//   Share2,
//   Trash2,
//   ArrowUp,
//   ArrowDown,
// } from "lucide-react";
// import { formatRelativeTime } from "../../utils/formatDate";
// import useAuthStore from "../../store/authStore";
// import usePostStore from "../../store/postStore";
// import toast from "react-hot-toast";
// import api from "../../services/api";

// const PostCard = ({ post, showCommunity = true }) => {
//   const { user } = useAuthStore();
//   const { updatePostVote, deletePost } = usePostStore();
//   const navigate = useNavigate();

//   const handleVote = async (type) => {
//     if (!user) {
//       toast.error("Login to vote");
//       navigate("/login");
//       return;
//     }

//     const previousScore = post.voteScore;
//     const previousVote = post.userVote;

//     // Optimistic update
//     let newScore = previousScore;
//     let newVote = type;

//     if (previousVote === type) {
//       // Undo vote
//       newScore = type === "UP" ? previousScore - 1 : previousScore + 1;
//       newVote = null;
//     } else if (previousVote === null) {
//       newScore = type === "UP" ? previousScore + 1 : previousScore - 1;
//     } else {
//       // Switch vote
//       newScore = type === "UP" ? previousScore + 2 : previousScore - 2;
//     }

//     updatePostVote(post.id, newScore, newVote);

//     try {
//       const { data } = await api.post(`/posts/${post.id}/vote`, { type });
//       updatePostVote(post.id, data.voteScore, data.userVote);
//     } catch {
//       // Rollback on failure
//       updatePostVote(post.id, previousScore, previousVote);
//       toast.error("Failed to vote");
//     }
//   };

//   const handleDelete = async () => {
//     if (!window.confirm("Delete this post?")) return;
//     const result = await deletePost(post.id);
//     if (result.success) toast.success("Post deleted");
//     else toast.error("Failed to delete post");
//   };

//   const handleShare = () => {
//     navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
//     toast.success("Link copied!");
//   };

//   return (
//     <div className="card flex hover:border-gray-400 transition-colors">
//       {/* Vote Column */}
//       <div className="w-10 bg-gray-50 flex flex-col items-center py-2 gap-1 rounded-l-md flex-shrink-0">
//         <button
//           onClick={() => handleVote("UP")}
//           className={`p-1 rounded hover:bg-gray-200 transition-colors ${
//             post.userVote === "UP" ? "text-reddit-orange" : "text-gray-400"
//           }`}
//         >
//           <ArrowUp size={18} strokeWidth={post.userVote === "UP" ? 2.5 : 1.5} />
//         </button>

//         <span
//           className={`text-xs font-bold ${
//             post.userVote === "UP"
//               ? "text-reddit-orange"
//               : post.userVote === "DOWN"
//                 ? "text-reddit-blue"
//                 : "text-gray-700"
//           }`}
//         >
//           {post.voteScore > 999
//             ? `${(post.voteScore / 1000).toFixed(1)}k`
//             : post.voteScore}
//         </span>

//         <button
//           onClick={() => handleVote("DOWN")}
//           className={`p-1 rounded hover:bg-gray-200 transition-colors ${
//             post.userVote === "DOWN" ? "text-reddit-blue" : "text-gray-400"
//           }`}
//         >
//           <ArrowDown
//             size={18}
//             strokeWidth={post.userVote === "DOWN" ? 2.5 : 1.5}
//           />
//         </button>
//       </div>

//       {/* Content */}
//       <div className="flex-1 p-3 min-w-0">
//         {/* Meta */}
//         <div className="flex items-center flex-wrap gap-1 text-xs text-gray-500 mb-2">
//           {showCommunity && (
//             <>
//               <Link
//                 to={`/r/${post.community.slug}`}
//                 className="font-bold text-gray-900 hover:underline"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 r/{post.community.name}
//               </Link>
//               <span>•</span>
//             </>
//           )}
//           <span>Posted by</span>
//           <Link
//             to={`/u/${post.author.username}`}
//             className="hover:underline"
//             onClick={(e) => e.stopPropagation()}
//           >
//             u/{post.author.username}
//           </Link>
//           <span>•</span>
//           <span>{formatRelativeTime(post.createdAt)}</span>
//         </div>

//         {/* Title */}
//         <Link to={`/post/${post.id}`}>
//           <h3 className="font-semibold text-gray-900 text-base leading-snug hover:text-reddit-orange transition-colors line-clamp-3">
//             {post.title}
//           </h3>
//         </Link>

//         {/* Content Preview */}
//         {post.type === "text" && post.content && (
//           <p className="text-sm text-gray-600 mt-1.5 line-clamp-3 leading-relaxed">
//             {post.content}
//           </p>
//         )}

//         {post.type === "image" && post.imageUrl && (
//           <Link to={`/post/${post.id}`}>
//             <img
//               src={post.imageUrl}
//               alt={post.title}
//               className="mt-2 max-h-96 w-full object-cover rounded"
//               loading="lazy"
//             />
//           </Link>
//         )}

//         {post.type === "link" && post.imageUrl && (
//           <a
//             href={post.imageUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="mt-1.5 flex items-center gap-1 text-xs text-reddit-blue hover:underline"
//             onClick={(e) => e.stopPropagation()}
//           >
//             🔗 {post.imageUrl}
//           </a>
//         )}

//         {/* Action Bar */}
//         <div className="flex items-center gap-1 mt-3 flex-wrap">
//           <Link to={`/post/${post.id}`}>
//             <button className="btn-ghost text-xs">
//               <MessageSquare size={14} />
//               {post._count.comments} Comments
//             </button>
//           </Link>

//           <button onClick={handleShare} className="btn-ghost text-xs">
//             <Share2 size={14} />
//             Share
//           </button>

//           {user?.id === post.author.id && (
//             <button
//               onClick={handleDelete}
//               className="btn-ghost text-xs text-red-400 hover:text-red-500 hover:bg-red-50"
//             >
//               <Trash2 size={14} />
//               Delete
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PostCard;
