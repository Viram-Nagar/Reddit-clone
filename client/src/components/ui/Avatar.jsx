import { useState } from "react";
import { Link } from "react-router-dom";

const SIZE_CLASSES = {
  xs: "w-5 h-5 text-xs",
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-xl",
  "2xl": "w-20 h-20 text-2xl",
};

// Deterministic color based on username
const getUserColor = (username = "") => {
  const colors = [
    "from-orange-400 to-red-500",
    "from-blue-400 to-purple-500",
    "from-green-400 to-teal-500",
    "from-pink-400 to-rose-500",
    "from-yellow-400 to-orange-500",
    "from-indigo-400 to-blue-500",
    "from-teal-400 to-cyan-500",
    "from-purple-400 to-pink-500",
  ];
  const index = username.charCodeAt(0) % colors.length;
  return colors[index];
};

const Avatar = ({
  username = "",
  src,
  size = "md",
  linkTo,
  className = "",
  ring = false,
}) => {
  const [imgError, setImgError] = useState(false);
  const color = getUserColor(username);
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  const AvatarInner = () => (
    <div
      className={`
        ${sizeClass}
        rounded-full flex-shrink-0 flex items-center justify-center
        bg-gradient-to-br ${color}
        font-bold text-white select-none overflow-hidden
        ${ring ? "ring-2 ring-white dark:ring-gray-800 ring-offset-0" : ""}
        ${className}
      `}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={username}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="leading-none">
          {username?.[0]?.toUpperCase() || "?"}
        </span>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link
        to={linkTo}
        className="hover:opacity-90 transition-opacity flex-shrink-0"
      >
        <AvatarInner />
      </Link>
    );
  }

  return <AvatarInner />;
};

export default Avatar;
