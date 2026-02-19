import { useEffect, useMemo, useState } from "react";

const THEME_STORAGE_KEY = "theme";
const THEME_MODES = ["light", "dark", "system"];
const SYSTEM_MODE = "system";
const DARK_THEME = "dark";
const LIGHT_THEME = "light";

const getSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? DARK_THEME : LIGHT_THEME;

const resolvePreferredTheme = () => {
  if (typeof window === "undefined") return "light";

  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (THEME_MODES.includes(savedTheme)) return savedTheme;
  return SYSTEM_MODE;
};

const applyTheme = (theme) => {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === DARK_THEME);
  root.style.colorScheme = theme;
};

export default function ThemeToggle({ className = "" }) {
  const [themeMode, setThemeMode] = useState(resolvePreferredTheme);
  const [resolvedTheme, setResolvedTheme] = useState(() =>
    themeMode === SYSTEM_MODE ? getSystemTheme() : themeMode
  );

  useEffect(() => {
    const nextTheme = themeMode === SYSTEM_MODE ? getSystemTheme() : themeMode;
    setResolvedTheme(nextTheme);
    applyTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  }, [themeMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handlePreferenceChange = () => {
      if (themeMode === SYSTEM_MODE) {
        const nextTheme = mediaQuery.matches ? DARK_THEME : LIGHT_THEME;
        setResolvedTheme(nextTheme);
        applyTheme(nextTheme);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handlePreferenceChange);
      return () => mediaQuery.removeEventListener("change", handlePreferenceChange);
    }

    mediaQuery.addListener(handlePreferenceChange);
    return () => mediaQuery.removeListener(handlePreferenceChange);
  }, [themeMode]);

  const currentModeLabel = useMemo(() => {
    if (themeMode === SYSTEM_MODE) {
      return resolvedTheme === DARK_THEME ? "System (Dark)" : "System (Light)";
    }
    return themeMode === DARK_THEME ? "Dark mode" : "Light mode";
  }, [resolvedTheme, themeMode]);

  const compactLabel = useMemo(() => {
    if (themeMode === SYSTEM_MODE) return "Auto";
    return themeMode === DARK_THEME ? "Dark" : "Light";
  }, [themeMode]);

  const switchThemeMode = () => {
    setThemeMode((prevMode) => {
      const currentIndex = THEME_MODES.indexOf(prevMode);
      const nextIndex = (currentIndex + 1) % THEME_MODES.length;
      return THEME_MODES[nextIndex];
    });
  };

  return (
    <button
      type="button"
      className={`btn-outline ${className}`}
      onClick={switchThemeMode}
      aria-label={`Theme: ${currentModeLabel}`}
      title={`Theme: ${currentModeLabel}`}
    >
      <span className="hidden sm:inline">{currentModeLabel}</span>
      <span className="sm:hidden">{compactLabel}</span>
    </button>
  );
}
