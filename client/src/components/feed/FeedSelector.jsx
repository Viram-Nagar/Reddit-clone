import { Home, Users } from "lucide-react";
import useAuthStore from "../../store/authStore";
import { Link } from "react-router-dom";

const TABS = [
  { id: "home", label: "Home", icon: <Home size={15} /> },
  {
    id: "following",
    label: "Following",
    icon: <Users size={15} />,
    authRequired: true,
  },
];

const FeedSelector = ({ feedType, onSelect }) => {
  const { user } = useAuthStore();

  return (
    <div className="bg-white border border-gray-200 rounded-md px-2 py-1.5 flex gap-1 mb-4">
      {TABS.map(({ id, label, icon, authRequired }) => {
        const isDisabled = authRequired && !user;

        return isDisabled ? (
          <Link key={id} to="/login" className="flex-1">
            <button
              className="flex items-center justify-center gap-1.5 w-full px-4 py-1.5 rounded text-sm font-semibold text-gray-400 hover:bg-gray-50 transition-all"
              title="Login to see your following feed"
            >
              {icon} {label}
              <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full ml-1">
                Login
              </span>
            </button>
          </Link>
        ) : (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`flex items-center justify-center gap-1.5 flex-1 px-4 py-1.5 rounded text-sm font-semibold transition-all ${
              feedType === id
                ? "bg-gray-100 text-gray-900 shadow-sm"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
          >
            <span className={feedType === id ? "text-reddit-orange" : ""}>
              {icon}
            </span>
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default FeedSelector;
