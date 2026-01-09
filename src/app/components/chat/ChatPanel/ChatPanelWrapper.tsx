"use client";

import Box from "@mui/material/Box";

export function ChatPanelWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        flex: 1,
        px: 2,
        overflowY: "auto",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {children}
    </Box>
  );
}
