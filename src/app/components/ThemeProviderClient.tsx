"use client";

import { createAppTheme } from "@/theme";
import { ThemeProvider, useMediaQuery } from "@mui/material";
import type { PaletteMode } from "@mui/material/styles";
import React from "react";

export type ColorMode = "system" | "light" | "dark";

type ColorModeContextValue = {
  mode: ColorMode;
  setMode: (mode: ColorMode) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
};

const ColorModeContext = React.createContext<ColorModeContextValue | undefined>(
  undefined,
);

export function useColorMode() {
  const context = React.useContext(ColorModeContext);
  if (!context) {
    throw new Error("useColorMode must be used within ThemeProviderClient");
  }
  return context;
}

const storageKey = "themeMode";
const accentStorageKey = "accentColor";
const defaultAccent = "#1976d2";

const isValidHexColor = (value: string) => /^#([0-9a-fA-F]{6})$/.test(value);

export default function ThemeProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = React.useState<ColorMode>("system");
  const [accentColor, setAccentColor] = React.useState(defaultAccent);
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)", {
    noSsr: true,
  });

  React.useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored === "light" || stored === "dark" || stored === "system") {
      setMode(stored);
    }
    const storedAccent = localStorage.getItem(accentStorageKey);
    if (storedAccent && isValidHexColor(storedAccent)) {
      setAccentColor(storedAccent);
    }
  }, []);

  const handleSetMode = React.useCallback((nextMode: ColorMode) => {
    setMode(nextMode);
    localStorage.setItem(storageKey, nextMode);
  }, []);

  const handleSetAccentColor = React.useCallback((nextColor: string) => {
    if (!isValidHexColor(nextColor)) return;
    setAccentColor(nextColor);
    localStorage.setItem(accentStorageKey, nextColor);
  }, []);

  const effectiveMode: PaletteMode =
    mode === "system" ? (prefersDark ? "dark" : "light") : mode;

  const theme = React.useMemo(
    () => createAppTheme(effectiveMode, accentColor),
    [effectiveMode, accentColor],
  );

  return (
    <ColorModeContext.Provider
      value={{
        mode,
        setMode: handleSetMode,
        accentColor,
        setAccentColor: handleSetAccentColor,
      }}
    >
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
}
