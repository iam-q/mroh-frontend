"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-roboto)",
  },
  cssVariables: true,
  palette: {
    background: {
      default: "#ecf2f9",
    },
  },
});

export default theme;
