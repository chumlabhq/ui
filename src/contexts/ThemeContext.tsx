import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * Global theme provider. Stores the current mode in localStorage and writes
 * `data-theme="dark"|"light"` on the document root so every CSS rule keyed
 * to `:root[data-theme="..."]` (see `src/index.css`) flips automatically.
 *
 * Available everywhere — used by the SiteHeader's theme toggle so the same
 * setting applies across the home, blog, FAQ, docs, and component demo
 * surfaces.
 */

export type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const STORAGE_KEY = "chumlab-theme";

function readInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* SSR or restricted storage */
  }
  return "dark";
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    // Mark the document as "theme-switching" for one frame so the global
    // CSS rule (see src/index.css) suppresses every CSS transition during
    // the swap. Without this, any element that uses `transition-colors`
    // or `transition-all` (sidebar inputs, search bars, buttons, table
    // rows, etc.) animates its color/bg/border over 150ms while the rest
    // of the page flips instantly — that desync is the visible "flash".
    root.classList.add("theme-switching");
    root.setAttribute("data-theme", theme);
    // Mirror the theme as a class on <html> so Tailwind's `dark:` variant
    // (configured against the `.dark` selector) tracks the toggle. Without
    // this, every `dark:bg-…` / `dark:text-…` utility in the component
    // demos would silently never activate when the user flips the toggle.
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
    // Two RAFs: first ensures the new theme styles have been applied,
    // second re-enables transitions cleanly so the next interaction
    // (hover, focus) animates as intended.
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        root.classList.remove("theme-switching");
      });
      (root as unknown as { _themeRaf2?: number })._themeRaf2 = raf2;
    });
    return () => {
      cancelAnimationFrame(raf1);
      const raf2 = (root as unknown as { _themeRaf2?: number })._themeRaf2;
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [theme]);

  const value: ThemeContextValue = {
    theme,
    setTheme: setThemeState,
    toggleTheme: () =>
      setThemeState((current) => (current === "dark" ? "light" : "dark")),
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Soft fallback so legacy callers (the docs ThemeContext, etc.) don't
    // crash if rendered outside the provider during a partial migration.
    return {
      theme: "dark",
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return ctx;
}
