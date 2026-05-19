import { Link } from "react-router-dom";
import { Users, Calendar, Shield } from "lucide-react";
import useAuthStore from "../../store/authStore";
import useCommunityStore from "../../store/communityStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CommunitySidebar = ({ community }) => {
  const { user } = useAuthStore();
  const { isMember, isJoining, toggleJoin } = useCommunityStore();
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!user) {
      toast.error("Login to join communities");
      navigate("/login");
      return;
    }
    const result = await toggleJoin(community.slug);
    if (result.success) {
      toast.success(
        result.joined
          ? `Joined r/${community.name}!`
          : `Left r/${community.name}`,
      );
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="space-y-4">
      {/* About Card */}
      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
        {/* Banner */}
        <div className="h-10 bg-gradient-to-r from-reddit-orange to-orange-400" />

        <div className="p-4">
          <h2 className="font-bold text-gray-900 mb-2">
            About r/{community.name}
          </h2>

          {community.description && (
            <p className="text-sm text-gray-600 mb-4">
              {community.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex gap-6 py-3 border-t border-gray-100">
            <div>
              <div className="font-bold text-gray-900">
                {community._count.members.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Users size={11} /> Members
              </div>
            </div>
            <div>
              <div className="font-bold text-gray-900">
                {community._count.posts.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <FileText size={11} /> Posts
              </div>
            </div>
          </div>

          {/* Created date */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 py-2 border-t border-gray-100">
            <Calendar size={12} />
            Created {formatDate(community.createdAt)}
          </div>

          {/* Creator */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 pb-2 border-b border-gray-100 mb-3">
            <Shield size={12} />
            Created by{" "}
            <Link
              to={`/u/${community.creator.username}`}
              className="text-reddit-blue hover:underline"
            >
              u/{community.creator.username}
            </Link>
          </div>

          {/* Join Button */}
          <button
            onClick={handleJoin}
            disabled={isJoining}
            className={`w-full py-1.5 rounded-full font-semibold text-sm transition-colors ${
              isMember
                ? "border border-reddit-orange text-reddit-orange hover:bg-orange-50"
                : "bg-reddit-orange text-white hover:bg-orange-600"
            }`}
          >
            {isJoining ? "..." : isMember ? "Joined ✓" : "Join"}
          </button>

          {/* Create Post CTA */}
          {user && (
            <Link to={`/r/${community.slug}/submit`}>
              <button className="w-full mt-2 py-1.5 rounded-full font-semibold text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                + Create Post
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Rules Card — static for MVP */}
      <div className="bg-white border border-gray-200 rounded-md p-4">
        <h3 className="font-bold text-gray-900 mb-3">
          r/{community.name} Rules
        </h3>
        {[
          "Be respectful",
          "No spam",
          "Stay on topic",
          "Follow Reddit guidelines",
        ].map((rule, i) => (
          <div
            key={i}
            className="flex gap-2 text-sm py-2 border-b border-gray-100 last:border-0"
          >
            <span className="font-bold text-gray-400">{i + 1}.</span>
            <span className="text-gray-700">{rule}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Need to import FileText inside CommunitySidebar too
import { FileText } from "lucide-react";

export default CommunitySidebar;
