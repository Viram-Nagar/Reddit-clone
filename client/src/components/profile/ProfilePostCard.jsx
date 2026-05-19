import { Link } from "react-router-dom";
import { ArrowUp, MessageSquare } from "lucide-react";
import { formatRelativeTime } from "../../utils/formatDate";
import Badge from "../ui/Badge";

const ProfilePostCard = ({ post }) => (
  <Link to={`/post/${post.id}`}>
    <div className="flex gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group border border-transparent hover:border-gray-200">
      {/* Vote score */}
      <div className="flex flex-col items-center justify-center w-10 flex-shrink-0">
        <ArrowUp
          size={14}
          className={`${
            post.voteScore > 0 ? "text-reddit-orange" : "text-gray-300"
          }`}
        />
        <span
          className={`text-xs font-bold ${
            post.voteScore > 0
              ? "text-reddit-orange"
              : post.voteScore < 0
                ? "text-reddit-blue"
                : "text-gray-500"
          }`}
        >
          {post.voteScore}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <Link
            to={`/r/${post.community.slug}`}
            className="text-xs font-semibold text-reddit-blue hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            r/{post.community.name}
          </Link>
          <span className="text-xs text-gray-400">
            {formatRelativeTime(post.createdAt)}
          </span>
          {post.type !== "text" && (
            <Badge variant={post.type === "image" ? "green" : "blue"}>
              {post.type === "image" ? "🖼 Image" : "🔗 Link"}
            </Badge>
          )}
        </div>

        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-reddit-orange transition-colors line-clamp-2">
          {post.title}
        </h3>

        {post.type === "text" && post.content && (
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
            {post.content}
          </p>
        )}

        <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-400">
          <MessageSquare size={11} />
          {post._count.comments}{" "}
          {post._count.comments === 1 ? "comment" : "comments"}
        </div>
      </div>

      {/* Thumbnail for image posts */}
      {post.type === "image" && post.imageUrl && (
        <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-100">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      )}
    </div>
  </Link>
);

export default ProfilePostCard;
