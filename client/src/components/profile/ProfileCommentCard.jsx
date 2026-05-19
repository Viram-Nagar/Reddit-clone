import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { formatRelativeTime } from "../../utils/formatDate";

const ProfileCommentCard = ({ comment }) => (
  <Link to={`/post/${comment.post.id}`}>
    <div className="p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200 group">
      {/* Context — which post this is on */}
      <div className="flex items-center gap-1.5 mb-2 text-xs text-gray-400">
        <MessageSquare size={11} />
        <span>Commented on</span>
        <span className="font-semibold text-gray-700 group-hover:text-reddit-orange transition-colors line-clamp-1 flex-1">
          {comment.post.title}
        </span>
        <span>in</span>
        <Link
          to={`/r/${comment.post.community.slug}`}
          className="text-reddit-blue hover:underline font-medium flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          r/{comment.post.community.name}
        </Link>
      </div>

      {/* Comment content */}
      <div className="border-l-2 border-gray-200 pl-3 group-hover:border-reddit-orange transition-colors">
        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
          {comment.content}
        </p>
      </div>

      {/* Time */}
      <p className="text-xs text-gray-400 mt-1.5 pl-3">
        {formatRelativeTime(comment.createdAt)}
        {comment.createdAt !== comment.updatedAt && (
          <span className="italic ml-1">(edited)</span>
        )}
      </p>
    </div>
  </Link>
);

export default ProfileCommentCard;
