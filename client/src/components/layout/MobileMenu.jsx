import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  X,
  Home,
  Compass,
  PlusCircle,
  User,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useEffect } from "react";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";

const MobileMenu = ({ isOpen, onClose }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Close on route change
  useEffect(() => {
    onClose();
  }, [pathname]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out!");
    navigate("/");
    onClose();
  };

  const NAV_LINKS = [
    { to: "/", icon: <Home size={18} />, label: "Home" },
    {
      to: "/communities",
      icon: <Compass size={18} />,
      label: "Explore Communities",
    },
    ...(user
      ? [
          {
            to: "/create-community",
            icon: <PlusCircle size={18} />,
            label: "Create Community",
          },
          {
            to: `/u/${user.username}`,
            icon: <User size={18} />,
            label: `u/${user.username}`,
          },
        ]
      : []),
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-reddit-orange rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-bold text-gray-800">reddit</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* User greeting */}
        {user && (
          <div className="px-4 py-3 bg-orange-50 border-b border-orange-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-reddit-orange flex items-center justify-center">
                <span className="text-white font-bold">
                  {user.username[0].toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  u/{user.username}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="p-3 space-y-1">
          {NAV_LINKS.map(({ to, icon, label }) => (
            <Link key={to} to={to}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === to
                    ? "bg-orange-50 text-reddit-orange"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span
                  className={
                    pathname === to ? "text-reddit-orange" : "text-gray-400"
                  }
                >
                  {icon}
                </span>
                {label}
              </div>
            </Link>
          ))}
        </nav>

        {/* Bottom auth actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Log Out
            </button>
          ) : (
            <div className="space-y-2">
              <Link to="/login" onClick={onClose}>
                <button className="btn-secondary w-full flex items-center justify-center gap-2">
                  <LogIn size={16} /> Log In
                </button>
              </Link>
              <Link to="/register" onClick={onClose}>
                <button className="btn-primary w-full flex items-center justify-center gap-2">
                  <UserPlus size={16} /> Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
