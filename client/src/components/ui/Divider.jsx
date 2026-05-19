const Divider = ({ label, className = "" }) => (
  <div className={`relative flex items-center ${className}`}>
    <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
    {label && (
      <span className="mx-3 text-xs text-gray-400 dark:text-gray-500 font-medium whitespace-nowrap">
        {label}
      </span>
    )}
    <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
  </div>
);

export default Divider;
