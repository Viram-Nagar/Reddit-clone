import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const useThemeStore = create(
  devtools(
    persist(
      (set, get) => ({
        // ─── State ────────────────────────────────
        isDark: false,

        // ─── Actions ──────────────────────────────
        toggleTheme: () => {
          const newIsDark = !get().isDark;
          set({ isDark: newIsDark });
          applyTheme(newIsDark);
        },

        setTheme: (isDark) => {
          set({ isDark });
          applyTheme(isDark);
        },

        initTheme: () => {
          const { isDark } = get();

          // Check system preference if no saved preference
          const systemPrefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)",
          ).matches;

          const shouldBeDark = isDark ?? systemPrefersDark;
          set({ isDark: shouldBeDark });
          applyTheme(shouldBeDark);
        },
      }),
      {
        name: "theme-storage",
        partialize: (state) => ({ isDark: state.isDark }),
      },
    ),
    { name: "ThemeStore" },
  ),
);

// ─── Apply theme to DOM ────────────────────────────
const applyTheme = (isDark) => {
  const root = document.documentElement;
  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

export default useThemeStore;
