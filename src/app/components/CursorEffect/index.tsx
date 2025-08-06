"use client";

import Box from "@mui/material/Box";

const NUM_DOTS = 8;

const colors = [
  "#FFF",
  "#7928CA",
  "#FF4D4D",
  "#FF8C00",
  "#FFD500",
  "#00E5FF",
  "#00FF85",
  "#FF00D2",
];

type CursorEffectProps = {
  setDotRef: (index: number) => (el: HTMLDivElement | null) => void;
};

export default function CursorEffect({ setDotRef }: CursorEffectProps) {
  return (
    <>
      {colors.map((color, i) => (
        <Box
          key={i}
          ref={setDotRef(i)}
          sx={{
            pointerEvents: "none",
            position: "fixed",
            top: 0,
            left: 0,
            width: 20,
            height: 20,
            borderRadius: "50%",
            backgroundColor: `${color}80`,
            filter: `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 10px ${color})`,
            opacity: 0,
            transform: "translate3d(-100px, -100px, 0)",
            transition: "opacity 0.3s",
            zIndex: 9999,
            mixBlendMode: "normal",
            willChange: "transform",
            // animation: `${pulse} 2s ease-in-out infinite`,
          }}
        />
      ))}
    </>
  );
}
