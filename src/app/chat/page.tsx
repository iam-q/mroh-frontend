"use client";

import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import CardContainer from "../components/CardContainer";
import ChatInput from "../components/ChatInput";
import ChatPanel, { Message } from "../components/ChatPanel";
import { ChatPanelWrapper } from "../components/ChatPanel/ChatPanelWrapper";
import Memoji from "../components/Memoji";
import QuickChatToggle from "../components/QuickChatToggle";
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

export default function ChatPage() {
  const searchParams = useSearchParams();

  const [isClient, setIsClient] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const lastFetchedQueryRef = useRef<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const streamingContentRef = useRef<string>("");
  const throttledUpdate = useRef<NodeJS.Timeout | null>(null);
  const assistantMessageIdRef = useRef<string | null>(null);

  const handleClick = () => setShowQuickQuestions(!showQuickQuestions);
  const headerHeight = 100;
  const footerHeight = showQuickQuestions ? 230 : 100;

  // ✅ Mark as client-ready (ensures hydration complete)
  useEffect(() => {
    setIsClient(true);
  }, []);

  const sendQuery = useCallback((userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed) return;

    console.log("sendQuery called with:", trimmed);

    streamingContentRef.current = "";
    setIsLoading(true);

    const assistantId = `assistant-${Date.now()}`;
    assistantMessageIdRef.current = assistantId;

    setMessages((prev) => [
      ...prev,
      { role: "user" as const, content: trimmed, id: `user-${Date.now()}` },
      { role: "assistant" as const, content: "", id: assistantId },
    ]);

    const url = `http://localhost:8080/chat?role=user&content=${encodeURIComponent(
      userText
    )}`;
    const eventSource = new EventSource(url, { withCredentials: true });
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      if (event.data === "[DONE]") {
        if (throttledUpdate.current) {
          clearTimeout(throttledUpdate.current);
          throttledUpdate.current = null;
        }
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, content: streamingContentRef.current }
              : msg
          )
        );
        eventSource.close();
        setIsLoading(false);
        assistantMessageIdRef.current = null;
        return;
      }

      if (event.data.startsWith("[ERROR]")) {
        streamingContentRef.current += "\n" + event.data;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, content: streamingContentRef.current }
              : msg
          )
        );
        eventSource.close();
        setIsLoading(false);
        assistantMessageIdRef.current = null;
        return;
      }

      streamingContentRef.current += event.data;

      if (throttledUpdate.current) clearTimeout(throttledUpdate.current);

      throttledUpdate.current = setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, content: streamingContentRef.current }
              : msg
          )
        );
      }, 50);
    };

    eventSource.onerror = (err) => {
      console.error("SSE error", err);
      if (throttledUpdate.current) clearTimeout(throttledUpdate.current);
      eventSource.close();

      streamingContentRef.current += "\n[Error receiving stream]";
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? { ...msg, content: streamingContentRef.current }
            : msg
        )
      );

      setIsLoading(false);
      assistantMessageIdRef.current = null;
    };

    eventSource.onopen = () => console.log("SSE connection opened");
  }, []);

  const handleSearch = () => {
    const currentQuery = query.trim();
    if (!currentQuery) return;
    setQuery("");
    sendQuery(currentQuery);
  };

  // ✅ Fixed: run only after client hydration
  useEffect(() => {
    if (!isClient) return;

    const userQuery = searchParams.get("content");
    console.log("useEffect triggered, userQuery:", userQuery);

    if (userQuery && userQuery !== lastFetchedQueryRef.current) {
      lastFetchedQueryRef.current = userQuery;
      console.log("Calling sendQuery from useEffect");
      sendQuery(userQuery);
    }

    return () => {
      if (throttledUpdate.current) clearTimeout(throttledUpdate.current);
      if (eventSourceRef.current) eventSourceRef.current.close();
    };
  }, [isClient, searchParams, sendQuery]);

  return (
    <Grid2
      container
      direction="column"
      sx={{ height: "100vh", overflow: "hidden" }}
      columns={1}
      wrap="nowrap"
    >
      <Grid2
        component="div"
        sx={{
          height: headerHeight,
          p: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
          zIndex: 10,
          mb: 5,
        }}
      >
        <Memoji width={100} />
      </Grid2>

      <Box sx={{ flexGrow: 1, overflowY: "auto", mx: 10 }}>
        <ChatPanelWrapper>
          <ChatPanel isLoading={isLoading} messages={messages} />
        </ChatPanelWrapper>
      </Box>

      <Grid2
        component="div"
        sx={{
          height: footerHeight,
          px: 2,
          py: 3,
          flexShrink: 0,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <QuickChatToggle show={showQuickQuestions} handleClick={handleClick} />
        {showQuickQuestions && (
          <Box sx={{ mb: 2 }}>
            <CardContainer shrink />
          </Box>
        )}
        <Box sx={{ mx: "auto", maxWidth: 800, width: "100%" }}>
          <ChatInput
            maxWidth={800}
            query={query}
            setQuery={setQuery}
            onSearch={handleSearch}
          />
        </Box>
      </Grid2>
    </Grid2>
  );
}