const VARIANTS = {
  orange: "bg-orange-100 text-orange-700",
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
  gray: "bg-gray-100 text-gray-600",
  red: "bg-red-100 text-red-700",
};

const Badge = ({ children, variant = "gray", className = "" }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
      VARIANTS[variant] || VARIANTS.gray
    } ${className}`}
  >
    {children}
  </span>
);

export default Badge;
