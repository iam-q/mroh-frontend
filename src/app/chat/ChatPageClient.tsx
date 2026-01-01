"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import CardContainer from "../components/CardContainer";
import ChatInput from "../components/ChatInput";
import ChatPanel, { Message } from "../components/ChatPanel";
import { ChatPanelWrapper } from "../components/ChatPanel/ChatPanelWrapper";
import Memoji from "../components/Memoji";
import QuickChatToggle from "../components/QuickChatToggle";
import { apiUrl } from "../utils/api";

export default function ChatPageClient() {
  const searchParams = useSearchParams();

  const [isClient, setIsClient] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [limitReached, setLimitReached] = useState(false);

  const lastFetchedQueryRef = useRef<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const streamingContentRef = useRef<string>("");
  const throttledUpdate = useRef<NodeJS.Timeout | null>(null);
  const assistantMessageIdRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = () => setShowQuickQuestions(!showQuickQuestions);
  const headerHeight = 100;
  const footerHeight = showQuickQuestions ? 230 : 100;

  // ✅ Mark as client-ready (ensures hydration complete)
  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchRemaining = useCallback(async () => {
    try {
      const res = await fetch(apiUrl("/chat/remaining"), {
        credentials: "include",
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data && typeof data.remaining === "number") {
        setRemaining(data.remaining);
        setLimitReached(data.remaining <= 0);
        return data.remaining as number;
      }
    } catch {
      // Ignore remaining lookup errors
    }
    return null;
  }, []);

  const chatsDisabled = limitReached || (remaining !== null && remaining <= 0);

  const sendQuery = useCallback(
    (userText: string) => {
      const trimmed = userText.trim();
      if (!trimmed || chatsDisabled) return;

      console.log("sendQuery called with:", trimmed);

      streamingContentRef.current = "";
      setIsLoading(true);
      setRemaining(null);

      const assistantId = `assistant-${Date.now()}`;
      assistantMessageIdRef.current = assistantId;

      setMessages((prev) => [
        ...prev,
        { role: "user" as const, content: trimmed, id: `user-${Date.now()}` },
        { role: "assistant" as const, content: "", id: assistantId },
      ]);

      const url = apiUrl(
        `/chat?role=user&content=${encodeURIComponent(userText)}`,
      );
      const eventSource = new EventSource(url, { withCredentials: true });
      eventSourceRef.current = eventSource;

      const throttleInterval = 10;

      eventSource.addEventListener("meta", (event) => {
        const messageEvent = event as MessageEvent;
        try {
          const data = JSON.parse(messageEvent.data);
          if (typeof data?.remaining === "number") {
            setRemaining(data.remaining);
            setLimitReached(data.remaining <= 0);
          }
        } catch {
          // Ignore malformed meta events
        }
      });

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
                : msg,
            ),
          );
          fetchRemaining();
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
                : msg,
            ),
          );
          eventSource.close();
          setIsLoading(false);
          assistantMessageIdRef.current = null;
          return;
        }

        streamingContentRef.current += event.data;

        // Clear previous timeout if any
        if (throttledUpdate.current) clearTimeout(throttledUpdate.current);

        // Schedule next update with throttleInterval
        throttledUpdate.current = setTimeout(() => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId
                ? { ...msg, content: streamingContentRef.current }
                : msg,
            ),
          );
        }, throttleInterval);
      };

      eventSource.onerror = (err) => {
        console.error("SSE error", err);
        if (throttledUpdate.current) clearTimeout(throttledUpdate.current);
        eventSource.close();

        const currentAssistantId = assistantMessageIdRef.current;
        fetchRemaining().then((value) => {
          if (value !== null && value <= 0) {
            return;
          }
          if (!currentAssistantId) return;
          streamingContentRef.current += "\n[Error receiving stream]";
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === currentAssistantId
                ? { ...msg, content: streamingContentRef.current }
                : msg,
            ),
          );
        });

        setIsLoading(false);
        assistantMessageIdRef.current = null;
      };

      eventSource.onopen = () => console.log("SSE connection opened");
    },
    [chatsDisabled, fetchRemaining],
  );

  const handleSearch = () => {
    const currentQuery = query.trim();
    if (chatsDisabled) {
      setLimitReached(true);
      return;
    }
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

  useEffect(() => {
    if (!isClient) return;
    fetchRemaining();
  }, [fetchRemaining, isClient]);

  return (
    <Grid2
      ref={containerRef}
      container
      direction="column"
      sx={{ height: "100vh", overflow: "hidden", position: "relative" }}
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
          mt: 8,
        }}
      >
        <Memoji width={100} />
      </Grid2>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          mb: 5,
        }}
      >
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
        <QuickChatToggle
          show={showQuickQuestions}
          handleClick={handleClick}
          disabled={chatsDisabled}
        />
        {showQuickQuestions && (
          <Box
            sx={{
              mb: 2,
              opacity: chatsDisabled ? 0.5 : 1,
              pointerEvents: chatsDisabled ? "none" : "auto",
            }}
          >
            <CardContainer shrink />
          </Box>
        )}
        <Box sx={{ mx: "auto", maxWidth: 800, width: "100%" }}>
          <ChatInput
            maxWidth={800}
            query={query}
            setQuery={setQuery}
            onSearch={handleSearch}
            disabled={chatsDisabled}
          />
          {remaining !== null && (
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 1,
                textAlign: "center",
                color: "#6b6b6b",
              }}
            >
              Remaining messages: {remaining}
            </Typography>
          )}
        </Box>
      </Grid2>
      <Snackbar
        open={limitReached}
        onClose={() => setLimitReached(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ position: "absolute" }}
      >
        <Alert severity="warning" sx={{ width: "100%" }}>
          You have exceeded the 10 message limit.
        </Alert>
      </Snackbar>
    </Grid2>
  );
}
