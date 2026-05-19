import { Link } from "react-router-dom";
import { Users, FileText } from "lucide-react";

const CommunityCard = ({ community }) => {
  return (
    <Link to={`/r/${community.slug}`}>
      <div className="card p-4 flex items-start gap-4 hover:shadow-sm transition-all">
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-reddit-orange to-orange-400 flex items-center justify-center flex-shrink-0">
          {community.icon ? (
            <img
              src={community.icon}
              alt={community.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-white font-bold text-lg">
              {community.name[0].toUpperCase()}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 truncate">
              r/{community.name}
            </h3>
          </div>
          {community.description && (
            <p className="text-gray-500 text-sm mt-0.5 line-clamp-2">
              {community.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Users size={12} />
              {community._count.members.toLocaleString()} members
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <FileText size={12} />
              {community._count.posts.toLocaleString()} posts
            </span>
          </div>
        </div>

        {/* Arrow */}
        <div className="text-gray-300 flex-shrink-0">›</div>
      </div>
    </Link>
  );
};

export default CommunityCard;
