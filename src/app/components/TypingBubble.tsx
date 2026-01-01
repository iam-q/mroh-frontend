"use client";

import Box from "@mui/material/Box";
import { motion } from "framer-motion";

export function TypingBubble() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        px: 2,
        py: 1,
        borderRadius: 2,
        backgroundColor: "#f0f0f0",
        width: "fit-content",
      }}
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: "#555",
            display: "inline-block",
          }}
        />
      ))}
    </Box>
  );
}
