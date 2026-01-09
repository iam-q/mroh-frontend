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
  disabled?: boolean;
};

export default function ChatInput({
  maxWidth,
  query,
  setQuery,
  onSearch,
  disabled = false,
}: ChatInput) {
  const theme = useTheme();

  return (
    <Box sx={{ width: "100%", maxWidth: { maxWidth }, mx: "auto" }}>
      <TextField
        fullWidth
        placeholder="Ask me anything..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={disabled}
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
                disabled={disabled || !query.trim()}
                sx={{
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  bgcolor:
                    disabled || !query.trim()
                      ? "#ccc"
                      : theme.palette.primary.main,
                  color:
                    disabled || !query.trim()
                      ? "#666"
                      : theme.palette.primary.contrastText,
                  "&:hover": {
                    bgcolor:
                      disabled || !query.trim()
                        ? "#bbb"
                        : theme.palette.primary.dark,
                  },
                }}
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" && query.trim()) {
            onSearch();
          }
        }}
      />
    </Box>
  );
}
