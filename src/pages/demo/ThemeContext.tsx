/**
 * Backward-compat shim. The docs used to own a local theme context — now
 * the entire site uses the global ThemeProvider in
 * `src/contexts/ThemeContext.tsx`. This module re-exports a `useTheme()`
 * hook with the same shape (`isDarkMode`, `toggleDarkMode`) so existing
 * demo files don't need to change.
 */

import { useTheme as useGlobalTheme } from "../../contexts/ThemeContext";

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useTheme = (): ThemeContextType => {
  const { theme, toggleTheme } = useGlobalTheme();
  return {
    isDarkMode: theme === "dark",
    toggleDarkMode: toggleTheme,
  };
};
