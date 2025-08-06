"use client";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

type ChatInput = {
  maxWidth: number;
  query: string;
  setQuery: (value: string) => void;
  onSearch: () => void;
};

export default function ChatInput({
  maxWidth,
  query,
  setQuery,
  onSearch,
}: ChatInput) {
  const theme = useTheme();

  return (
    <Box sx={{ width: "100%", maxWidth: { maxWidth }, mx: "auto" }}>
      <TextField
        fullWidth
        placeholder="Ask me anything..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        variant="outlined"
        size="medium"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "50px",
            paddingRight: 0,
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end" sx={{ marginRight: 3 }}>
              <IconButton
                aria-label="ask question"
                onClick={onSearch}
                edge="end"
                disabled={!query.trim()}
                sx={{
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  bgcolor: query.trim() ? theme.palette.primary.main : "#ccc",
                  color: query.trim()
                    ? theme.palette.primary.contrastText
                    : "#666",
                  "&:hover": {
                    bgcolor: query.trim() ? theme.palette.primary.dark : "#bbb",
                  },
                }}
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && query.trim()) {
            onSearch();
          }
        }}
      />
    </Box>
  );
}
