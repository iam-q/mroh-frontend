import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

type QuickChatToggleProps = {
  show: boolean;
  handleClick: () => void;
};
export default function QuickChatToggle({
  show,
  handleClick,
}: QuickChatToggleProps) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        mb: show ? 2 : 0,
        width: "fit-content",
        mx: "auto",
      }}
      onClick={handleClick}
    >
      <KeyboardArrowDownIcon
        sx={{
          transform: show ? "rotate(180deg)" : "none",
          transition: "transform 0.3s",
        }}
      />
      <Button>{show ? "Hide quick questions" : "Show quick questions"}</Button>
    </Box>
  );
}
