import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

type QuickChatToggleProps = {
  show: boolean;
  handleClick: () => void;
  disabled?: boolean;
};
export default function QuickChatToggle({
  show,
  handleClick,
  disabled = false,
}: QuickChatToggleProps) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        mb: show ? 2 : 0,
        width: "fit-content",
        mx: "auto",
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
      onClick={disabled ? undefined : handleClick}
    >
      <KeyboardArrowDownIcon
        sx={{
          transform: show ? "rotate(180deg)" : "none",
          transition: "transform 0.3s",
          color: disabled ? "#9a9a9a" : "inherit",
        }}
      />
      <Button disabled={disabled}>
        {show ? "Hide quick questions" : "Show quick questions"}
      </Button>
    </Box>
  );
}
