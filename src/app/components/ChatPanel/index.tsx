"use client";

import { TypingBubble } from "@/app/components/TypingBubble";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface Message {
  role: "user" | "assistant";
  content: string;
  id?: string;
}

type ChatPanelProps = {
  messages: Message[];
  isLoading: boolean;
};

function formatAssistantMarkdown(content: string) {
  let text = content.replace(/\r\n/g, "\n").trim();
  const hasParagraphs = /\n\s*\n/.test(text);
  const hasLineBreaks = text.includes("\n");

  text = text.replace(/:(?=[A-Z])/g, ":\n\n");
  text = text.replace(/\t+/g, " ");
  text = text.replace(/:\s*\+\s*/g, ":\n* ");
  text = text.replace(/^\s*\+\s+/gm, "* ");
  text = text.replace(/^\s*[•-]\s+/gm, "* ");
  text = text.replace(/^\s*\*\s+/gm, "* ");
  text = text.replace(/\s*(\d+\.)\s+/g, "\n$1 ");
  text = text.replace(/([.!?])\s+(?=[A-Z0-9*#])/g, "$1\n\n");
  text = text.replace(/^\s*\d+\.\s*$/gm, "");
  text = text.replace(/^\s*[*+-]\s*$/gm, "");
  text = text.replace(/\n{3,}/g, "\n\n");

  if (!hasParagraphs && !hasLineBreaks) {
    text = text.replace(/([.!?])\s+(?=[A-Z])/g, "$1\n\n");
  }

  const lines = text.split("\n");
  const out: string[] = [];
  let listMode = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      out.push("");
      listMode = false;
      continue;
    }

    const isListItem = /^(\*|\d+\.)\s+/.test(trimmed);
    const endsWithColon = trimmed.endsWith(":") && trimmed.length <= 80;

    if (isListItem) {
      out.push(trimmed);
      listMode = endsWithColon;
      continue;
    }

    if (listMode) {
      out.push(`* ${trimmed}`);
      continue;
    }

    out.push(trimmed);
    listMode = endsWithColon;
  }

  return out
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function AssistantMarkdown({ content }: { content: string }) {
  const formatted = formatAssistantMarkdown(content);
  const bodyTextSx = {
    lineHeight: 1.8,
    color: "#1f1f1f",
  } as const;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <Typography
            variant="h6"
            sx={{ ...bodyTextSx, fontWeight: 700, mt: 0, mb: 1.5 }}
          >
            {children}
          </Typography>
        ),
        h2: ({ children }) => (
          <Typography
            variant="subtitle1"
            sx={{ ...bodyTextSx, fontWeight: 700, mt: 2, mb: 1 }}
          >
            {children}
          </Typography>
        ),
        h3: ({ children }) => (
          <Typography
            variant="subtitle1"
            sx={{ ...bodyTextSx, fontWeight: 600, mt: 1.5, mb: 0.75 }}
          >
            {children}
          </Typography>
        ),
        p: ({ children }) => (
          <Typography
            variant="body1"
            sx={{ ...bodyTextSx, fontSize: "1rem", mb: 1.5 }}
          >
            {children}
          </Typography>
        ),
        ul: ({ children }) => (
          <Box
            component="ul"
            sx={{
              pl: 3,
              mb: 1.5,
              mt: 0.5,
              listStyleType: "disc",
              listStylePosition: "outside",
            }}
          >
            {children}
          </Box>
        ),
        ol: ({ children }) => (
          <Box
            component="ol"
            sx={{
              pl: 3,
              mb: 1.5,
              mt: 0.5,
              listStylePosition: "outside",
            }}
          >
            {children}
          </Box>
        ),
        li: ({ children }) => (
          <Box component="li" sx={{ mb: 0.75 }}>
            <Typography variant="body1" component="span" sx={bodyTextSx}>
              {children}
            </Typography>
          </Box>
        ),
        blockquote: ({ children }) => (
          <Box
            sx={{
              borderLeft: "3px solid #d8d1c7",
              pl: 2,
              my: 1.5,
              color: "#4d4d4d",
            }}
          >
            <Typography variant="body1" sx={bodyTextSx}>
              {children}
            </Typography>
          </Box>
        ),
        code: (props) => {
          const { inline, children } = props as {
            inline?: boolean;
            children: React.ReactNode;
          };
          if (inline) {
            return (
              <Box
                component="code"
                sx={{
                  px: 0.6,
                  py: 0.1,
                  borderRadius: 1,
                  backgroundColor: "#efebe6",
                  fontFamily:
                    "'SFMono-Regular', Consolas, 'Liberation Mono', monospace",
                  fontSize: "0.9rem",
                }}
              >
                {children}
              </Box>
            );
          }

          return (
            <Box
              component="pre"
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "#f1ede7",
                overflowX: "auto",
                fontFamily:
                  "'SFMono-Regular', Consolas, 'Liberation Mono', monospace",
                fontSize: "0.9rem",
                mb: 2,
              }}
            >
              {children}
            </Box>
          );
        },
        hr: () => <Box sx={{ borderTop: "1px solid #e3ddd3", my: 2 }} />,
        strong: ({ children }) => (
          <Box component="strong" sx={{ fontWeight: 700 }}>
            {children}
          </Box>
        ),
        em: ({ children }) => (
          <Box component="em" sx={{ fontStyle: "italic" }}>
            {children}
          </Box>
        ),
      }}
    >
      {formatted}
    </ReactMarkdown>
  );
}

export default function ChatPanel({ messages, isLoading }: ChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <Box sx={{ width: "100%", height: "100%", mb: 2 }}>
      {messages.map((msg, i) => {
        const showTyping =
          isLoading && i === messages.length - 1 && msg.role === "assistant";
        const isAssistant = msg.role === "assistant";

        // Don't render completely empty assistant messages
        if (msg.role === "assistant" && msg.content === "" && !showTyping)
          return null;

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
              elevation={isAssistant ? 0 : 2}
              sx={{
                px: isAssistant ? 3 : 2,
                py: isAssistant ? 2.5 : 1.5,
                maxWidth: isAssistant ? "80%" : "75%",
                backgroundColor: isAssistant ? "#fcfbf9" : "#1976d2",
                color: isAssistant ? "#1c1c1c" : "#fff",
                borderRadius: 3,
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                display: "flex",
                flexDirection: isAssistant ? "column" : "row",
                alignItems: isAssistant ? "stretch" : "center",
                gap: isAssistant ? 1.5 : 0,
                ...(isAssistant
                  ? {
                      border: "1px solid #e7e1d8",
                      boxShadow: "0 12px 26px rgba(20, 20, 20, 0.12)",
                      backgroundImage:
                        "linear-gradient(0deg, rgba(0,0,0,0.02), rgba(0,0,0,0.02))",
                    }
                  : {}),
              }}
            >
              <Box sx={{ flex: 1 }}>
                {isAssistant ? (
                  <AssistantMarkdown content={msg.content} />
                ) : (
                  <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                    {msg.content}
                  </Typography>
                )}
              </Box>

              {showTyping && (
                <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                  <TypingBubble />
                </Box>
              )}
            </Paper>
          </Box>
        );
      })}

      <div ref={bottomRef} />
    </Box>
  );
}
