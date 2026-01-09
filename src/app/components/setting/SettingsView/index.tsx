"use client";

import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

type SettingsViewProps = {
  title: string;
  children: ReactNode;
};

export function SettingsView({ title, children }: SettingsViewProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", alignItems: "center", height: 40 }}>
        <Typography variant="h6">{title}</Typography>
      </Box>
      <Box sx={{ mt: 2 }}>{children}</Box>
    </Box>
  );
}

type SettingsRowProps = {
  left: ReactNode;
  right?: ReactNode;
};

export function SettingsRow({ left, right }: SettingsRowProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box>{left}</Box>
      {right ? <Box>{right}</Box> : null}
    </Box>
  );
}
