"use client";

import Box from "@mui/material/Box";

type Memoji = {
  width: number;
};
export default function Memoji({ width }: Memoji) {
  return (
    <Box
      component="img"
      src="/images/me.png"
      alt="Memoji"
      sx={{
        width: { width },
        height: "auto",
      }}
    />
  );
}
