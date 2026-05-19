// ─── Sizes ────────────────────────────────────────────
const SIZES = {
  xs: "h-3 w-3 border-[2px]",
  sm: "h-4 w-4 border-[2px]",
  md: "h-6 w-6 border-[2px]",
  lg: "h-8 w-8 border-[3px]",
  xl: "h-12 w-12 border-[3px]",
};

// ─── Inline spinner ────────────────────────────────────
export const Spinner = ({ size = "md", className = "" }) => (
  <div
    className={`
      animate-spin rounded-full
      border-gray-300 dark:border-gray-600 border-t-reddit-orange
      ${SIZES[size]} ${className}
    `}
  />
);

// ─── Full page loading screen ──────────────────────────
export const PageLoader = ({ message = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
    <div className="relative">
      {/* Outer ring */}
      <div className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-700" />
      {/* Spinning arc */}
      <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-reddit-orange animate-spin" />
      {/* Center logo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-7 h-7 bg-reddit-orange rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">R</span>
        </div>
      </div>
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
      {message}
    </p>
  </div>
);

// ─── Button spinner ────────────────────────────────────
export const ButtonSpinner = ({ size = "sm" }) => (
  <Spinner size={size} className="inline-block" />
);

export default Spinner;
