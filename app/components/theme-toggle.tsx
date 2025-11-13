"use client";

import { useTheme } from "./theme-provider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-9 items-center gap-2 rounded-full border border-(--color-app-border) bg-(--color-app-surface) px-4 text-sm font-medium text-(--color-app-text) shadow-sm transition hover:border-(--color-app-accent) hover:text-(--color-app-text)"
      aria-label={
        theme === "dark"
          ? "Switch to light theme"
          : "Switch to dark theme"
      }
    >
      <span aria-hidden="true" className="text-lg">
        {theme === "dark" ? "🌞" : "🌙"}
      </span>
      <span className="hidden sm:inline">
        {theme === "dark" ? "Light mode" : "Dark mode"}
      </span>
    </button>
  );
}

