"use client";

import { Alert, Box, keyframes, Snackbar, Typography } from "@mui/material";

import { motion, MotionProps } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {
  forwardRef,
  HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import CardContainer from "./components/chat/CardContainer";
import ChatInput from "./components/chat/ChatInput";
import CursorEffect from "./components/CursorEffect";
import Memoji from "./components/Memoji";
import { apiUrl } from "./utils/api";

const NUM_DOTS = 8;

// Framer Motion wrappers
const MotionBox = motion(Box);
type MotionDivProps = MotionProps & HTMLAttributes<HTMLDivElement>;
const MotionDiv = forwardRef<HTMLDivElement, MotionDivProps>((props, ref) => {
  return <motion.div ref={ref} {...props} />;
});

const wave = keyframes`
  0% { transform: rotate(0deg); }
  15% { transform: rotate(15deg); }
  30% { transform: rotate(-10deg); }
  45% { transform: rotate(15deg); }
  60% { transform: rotate(-10deg); }
  75% { transform: rotate(15deg); }
  100% { transform: rotate(0deg); }
`;

// Page
export default function HomePage() {
  const [query, setQuery] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [donationNoticeOpen, setDonationNoticeOpen] = useState(false);
  const chatsDisabled = remaining !== null && remaining <= 0;
  const router = useRouter();
  const searchParams = useSearchParams();
  const dotsRef = useRef<(HTMLDivElement | null)[]>(Array(NUM_DOTS).fill(null));

  const positions = useRef(
    Array.from({ length: NUM_DOTS }, () => ({ x: -100, y: -100 })),
  );

  const setDotRef = (index: number) => (el: HTMLDivElement | null) => {
    dotsRef.current[index] = el;
  };

  const handleSearch = () => {
    if (chatsDisabled) return;
    if (!query.trim()) return;

    const encoded = encodeURIComponent(query.trim());
    router.push(`/chat?content=${encoded}`);
  };

  const fetchRemaining = useCallback(() => {
    fetch(apiUrl("/chat/remaining"), {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.remaining === "number") {
          setRemaining(data.remaining);
        }
      })
      .catch(() => {
        // Ignore remaining lookup errors
      });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      positions.current[0] = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId: number;

    const animate = () => {
      for (let i = 1; i < NUM_DOTS; i++) {
        const prev = positions.current[i - 1];
        const curr = positions.current[i];
        positions.current[i] = {
          x: curr.x + (prev.x - curr.x) * 0.2,
          y: curr.y + (prev.y - curr.y) * 0.2,
        };
      }

      positions.current.forEach((pos, i) => {
        const dot = dotsRef.current[i];
        if (dot) {
          dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
          dot.style.opacity = `${1 - i / NUM_DOTS}`;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    fetchRemaining();
  }, [fetchRemaining]);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) return;

    let active = true;

    const verifyDonation = async () => {
      try {
        const res = await fetch(
          `/api/stripe/session?session_id=${encodeURIComponent(sessionId)}`,
        );
        if (!res.ok) {
          throw new Error("Failed to verify donation session");
        }
        const data = await res.json();
        if (active && data?.paid) {
          setDonationNoticeOpen(true);
        }
      } catch {
        // Ignore verification errors and avoid showing false success
      } finally {
        if (active) {
          router.replace("/");
        }
      }
    };

    verifyDonation();

    return () => {
      active = false;
    };
  }, [router, searchParams]);

  return (
    <>
      <Snackbar
        open={donationNoticeOpen}
        onClose={() => setDonationNoticeOpen(false)}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Thank you! Your donation was successful.
        </Alert>
      </Snackbar>
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          px: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
          }}
        >
          <Typography variant="h4" component="h1" textAlign="center">
            Hey, I'm Q{" "}
            <Box
              component="span"
              sx={{
                display: "inline-block",
                animation: `${wave} 2s ease-in-out 1`,
                transformOrigin: "70% 70%",
                fontSize: "1.5em",
              }}
            >
              👋
            </Box>
          </Typography>
          <Typography
            variant="h2"
            component="h1"
            fontWeight="bold"
            textAlign="center"
          >
            AI Portfolio
          </Typography>
        </Box>
        {/* Memoji */}
        <Memoji width={300} />
        {/* Chat Input */}
        <ChatInput
          maxWidth={500}
          query={query}
          setQuery={setQuery}
          onSearch={handleSearch}
          disabled={chatsDisabled}
        />
        {/* Cards container */}
        <CardContainer shrink={false} />
        {remaining !== null && (
          <Typography
            variant="caption"
            sx={{ display: "block", textAlign: "center", color: "#6b6b6b" }}
          >
            Remaining messages: {remaining}
          </Typography>
        )}
      </Box>
      {/* Dots */}
      <CursorEffect setDotRef={setDotRef} />
    </>
  );
}
