import { Link } from "react-router-dom";
import { TrendingUp, Users } from "lucide-react";
import useFeedStore from "../../store/feedStore";

const TrendingBar = () => {
  const { trendingCommunities, isTrendingLoading } = useFeedStore();

  if (isTrendingLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-4 animate-pulse">
        <div className="h-4 w-32 bg-gray-200 rounded mb-3" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-2 py-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="h-3 w-24 bg-gray-200 rounded" />
              <div className="h-2.5 w-16 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!trendingCommunities.length) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
        <TrendingUp size={16} className="text-reddit-orange" />
        <h3 className="font-bold text-gray-900 text-sm">
          Trending Communities
        </h3>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-50">
        {trendingCommunities.map((community, index) => (
          <Link key={community.id} to={`/r/${community.slug}`}>
            <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors group">
              {/* Rank */}
              <span
                className={`text-xs font-bold w-4 text-center flex-shrink-0 ${
                  index === 0
                    ? "text-yellow-500"
                    : index === 1
                      ? "text-gray-400"
                      : index === 2
                        ? "text-orange-400"
                        : "text-gray-300"
                }`}
              >
                {index === 0
                  ? "🥇"
                  : index === 1
                    ? "🥈"
                    : index === 2
                      ? "🥉"
                      : index + 1}
              </span>

              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-reddit-orange to-orange-400 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">
                  {community.name[0].toUpperCase()}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 group-hover:text-reddit-orange transition-colors truncate">
                  r/{community.name}
                </p>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Users size={10} />
                  {community._count.members.toLocaleString()} members
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-gray-100">
        <Link to="/communities">
          <button className="text-xs text-reddit-blue hover:underline w-full text-center">
            View All Communities →
          </button>
        </Link>
      </div>
    </div>
  );
};

export default TrendingBar;
