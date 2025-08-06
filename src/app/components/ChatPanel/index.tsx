"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatPanelProps = {
  messages: Message[];
};

export default function ChatPanel({ messages }: ChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [typingContent, setTypingContent] = useState("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.role === "assistant") {
      setTypingContent("");
      let i = 0;

      const interval = setInterval(() => {
        i++;
        setTypingContent(lastMessage.content.slice(0, i));

        if (i >= lastMessage.content.length) {
          clearInterval(interval);
        }
      }, 20); // adjust typing speed here

      return () => clearInterval(interval);
    }
  }, [messages]);

  return (
    <Box
      sx={{
        width: "100%",
        px: 2,
        height: "100%",
        overflowY: "auto",
        mb: 2,
      }}
    >
      {messages.map((msg, i) => {
        const isLastAssistant =
          i === messages.length - 1 && msg.role === "assistant";
        const contentToShow = isLastAssistant ? typingContent : msg.content;

        return (
          <Box
            key={i}
            sx={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              mb: 2,
              border: "1px solid #eee",
            }}
          >
            <Paper
              elevation={2}
              sx={{
                px: 2,
                py: 1.5,
                maxWidth: "75%",
                backgroundColor: msg.role === "user" ? "#1976d2" : "#e0e0e0",
                color: msg.role === "user" ? "#fff" : "#000",
                borderRadius: 3,
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
              }}
            >
              <Typography variant="body1">{contentToShow}</Typography>
            </Paper>
          </Box>
        );
      })}
      <div ref={bottomRef} />
    </Box>
  );
}
