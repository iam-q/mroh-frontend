"use client";

import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2"; // sometimes imported from here
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CardContainer from "../components/CardContainer";
import ChatInput from "../components/ChatInput";
import ChatPanel, { Message } from "../components/ChatPanel";
import { ChatPanelWrapper } from "../components/ChatPanel/ChatPanelWrapper";
import Memoji from "../components/Memoji";
import QuickChatToggle from "../components/QuickChatToggle";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const handleClick = () => setShowQuickQuestions(!showQuickQuestions);
  const headerHeight = 100;
  const footerHeight = showQuickQuestions ? 230 : 100;
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const lastFetchedQueryRef = useRef<string | null>(null);

  const sendQuery = async (
    userText: string,
    options?: { skipUserMessage?: boolean },
  ) => {
    if (!userText.trim()) return;

    if (!options?.skipUserMessage) {
      const userMessage: Message = { role: "user", content: userText };
      setMessages((prev) => [...prev, userMessage]);
    }

    try {
      const res = await fetch("http://localhost:8080/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role: "user", content: userText }),
      });

      const data = await res.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || "No response",
      };

      if (options?.skipUserMessage) {
        // If we're skipping user message (e.g. from useEffect), overwrite both messages
        setMessages([{ role: "user", content: userText }, assistantMessage]);
      } else {
        // Normal flow — just append assistant response
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (err) {
      console.error("Error fetching response:", err);
      const fallback: Message = {
        role: "assistant",
        content: "Error loading response",
      };

      if (options?.skipUserMessage) {
        setMessages([{ role: "user", content: userText }, fallback]);
      } else {
        setMessages((prev) => [...prev, fallback]);
      }
    }
  };

  const handleSearch = () => {
    sendQuery(query);
    setQuery("");
  };

  useEffect(() => {
    const userQuery = searchParams.get("query");

    if (userQuery && userQuery !== lastFetchedQueryRef.current) {
      lastFetchedQueryRef.current = userQuery;
      setQuery(userQuery); // optional: populate input
      sendQuery(userQuery, { skipUserMessage: true });
    }
  }, [searchParams]);

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
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          mx: 40,
        }}
      >
        <ChatPanelWrapper>
          <ChatPanel messages={messages} />
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
