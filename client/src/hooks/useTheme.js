import { useEffect } from "react";
import useThemeStore from "../store/themeStore";

const useTheme = () => {
  const { isDark, toggleTheme, initTheme } = useThemeStore();

  // Initialize theme on mount
  useEffect(() => {
    initTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      // Only auto-switch if user hasn't manually set a preference
      const saved = localStorage.getItem("theme-storage");
      if (!saved) {
        useThemeStore.getState().setTheme(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return { isDark, toggleTheme };
};

export default useTheme;
