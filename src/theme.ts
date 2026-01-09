import type { PaletteMode } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";

export function createAppTheme(
  mode: PaletteMode,
  accentColor: string = "#1976d2",
) {
  return createTheme({
    typography: {
      fontFamily: "var(--font-roboto)",
    },
    cssVariables: true,
    palette: {
      mode,
      primary: {
        main: accentColor,
      },
      background: {
        default: mode === "dark" ? "#0f1115" : "#ecf2f9",
        paper: mode === "dark" ? "#15181e" : "#ffffff",
      },
    },
  });
}

const theme = createAppTheme("light");
export default theme;
