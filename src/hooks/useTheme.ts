"use client";

import { useState, useCallback, useEffect } from "react";
import type { ThemeConfig } from "@/types";
import { defaultDarkTheme, defaultLightTheme, generateTheme, injectTheme } from "@/lib/theme/engine";

interface UseThemeReturn {
  theme: ThemeConfig;
  mode: "light" | "dark";
  setTheme: (theme: ThemeConfig) => void;
  toggleMode: () => void;
  generateFromColor: (brandColor: string) => void;
  generateFromDescription: (description: string) => Promise<void>;
  resetTheme: () => void;
}

export function useTheme(initialMode: "light" | "dark" = "dark"): UseThemeReturn {
  const [theme, setThemeState] = useState<ThemeConfig>(
    initialMode === "dark" ? defaultDarkTheme : defaultLightTheme
  );
  const [mode, setMode] = useState<"light" | "dark">(initialMode);

  // Inject theme CSS variables whenever theme changes
  useEffect(() => {
    injectTheme(theme);
  }, [theme]);

  // Set data-theme attribute for CSS
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  const setTheme = useCallback((newTheme: ThemeConfig) => {
    setThemeState(newTheme);
    setMode(newTheme.mode);
  }, []);

  const toggleMode = useCallback(() => {
    setMode((prev) => {
      const newMode = prev === "dark" ? "light" : "dark";
      setThemeState((currentTheme) => {
        const newTheme = generateTheme({
          brandColor: currentTheme.colors.primary[500],
          mode: newMode,
        });
        return newTheme;
      });
      return newMode;
    });
  }, []);

  const generateFromColor = useCallback(
    (brandColor: string) => {
      const newTheme = generateTheme({ brandColor, mode });
      setThemeState(newTheme);
    },
    [mode]
  );

  const generateFromDescription = useCallback(
    async (description: string) => {
      try {
        const response = await fetch("/api/theme", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description, mode }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.theme) {
            setThemeState(data.theme);
          }
        }
      } catch {
        // Fall back to default theme generation
        const newTheme = generateTheme({ mode, description });
        setThemeState(newTheme);
      }
    },
    [mode]
  );

  const resetTheme = useCallback(() => {
    const defaultTheme = mode === "dark" ? defaultDarkTheme : defaultLightTheme;
    setThemeState(defaultTheme);
  }, [mode]);

  return {
    theme,
    mode,
    setTheme,
    toggleMode,
    generateFromColor,
    generateFromDescription,
    resetTheme,
  };
}
