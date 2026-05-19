import { useState, useRef, useEffect } from "react";

const POSITIONS = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const ARROWS = {
  top: "top-full left-1/2 -translate-x-1/2 border-t-gray-800 dark:border-t-gray-200 border-l-transparent border-r-transparent border-b-transparent",
  bottom:
    "bottom-full left-1/2 -translate-x-1/2 border-b-gray-800 dark:border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent",
  left: "left-full top-1/2 -translate-y-1/2 border-l-gray-800 dark:border-l-gray-200 border-t-transparent border-b-transparent border-r-transparent",
  right:
    "right-full top-1/2 -translate-y-1/2 border-r-gray-800 dark:border-r-gray-200 border-t-transparent border-b-transparent border-l-transparent",
};

const Tooltip = ({ children, content, position = "top", delay = 300 }) => {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  const show = () => {
    timerRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    clearTimeout(timerRef.current);
    setVisible(false);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  if (!content) return children;

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}

      {visible && (
        <div
          className={`absolute z-50 whitespace-nowrap pointer-events-none
                      animate-fade-in ${POSITIONS[position]}`}
        >
          <div
            className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900
                          text-xs font-medium px-2.5 py-1.5 rounded-md shadow-lg"
          >
            {content}
          </div>
          {/* Arrow */}
          <div className={`absolute w-0 h-0 border-4 ${ARROWS[position]}`} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
