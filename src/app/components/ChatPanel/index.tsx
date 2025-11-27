"use client";

import { TypingBubble } from "@/app/chat/page";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useEffect, useRef } from "react";

export interface Message {
  role: "user" | "assistant";
  content: string;
  id?: string;
}

type ChatPanelProps = {
  messages: Message[];
  isLoading: boolean;
};

export default function ChatPanel({ messages, isLoading }: ChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <Box sx={{ width: "100%", px: 2, height: "100%", overflowY: "auto", mb: 2 }}>
      {messages.map((msg, i) => {
        const showTyping = isLoading && i === messages.length - 1 && msg.role === "assistant";

        // Don't render completely empty assistant messages
        if (msg.role === "assistant" && msg.content === "" && !showTyping) return null;

        return (
          <Box
            key={msg.id || `${msg.role}-${i}`}
            sx={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              mb: 2,
            }}
          >
            <Paper
              elevation={2}
              sx={{
                px: 2,
                py: 1.5,
                maxWidth: "75%",
                backgroundColor: msg.role === "user" ? "#1976d2" : "#f0f0f0",
                color: msg.role === "user" ? "#fff" : "#000",
                borderRadius: 3,
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography variant="body1" sx={{ flex: 1 }}>
                {msg.content}
              </Typography>

              {/* Show typing animation inside the bubble while streaming */}
              {showTyping && <TypingBubble />}
            </Paper>
          </Box>
        );
      })}

      <div ref={bottomRef} />
    </Box>
  );
}