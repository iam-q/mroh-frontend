import { Box, Button, Typography } from "@mui/material";

export function DonationBanner({
  setDonationOpen,
}: {
  setDonationOpen: (open: boolean) => void;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        px: 2,
        py: 0.75,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={(theme) => ({
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          px: 1.5,
          py: 0.4,
          color: theme.palette.mode === "dark" ? "#e4ecf7" : "#243656",
          animation: "donationPillIn 400ms ease-out",
          "@keyframes donationPillIn": {
            from: { opacity: 0, transform: "translateY(-6px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        })}
      >
        <Typography sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
          If you like this project, consider supporting it!
        </Typography>
        <Button
          size="small"
          variant="contained"
          onClick={() => setDonationOpen(true)}
          sx={{
            textTransform: "none",
            px: 1.25,
            py: 0,
            minHeight: 24,
            fontSize: "0.75rem",
          }}
        >
          Donate
        </Button>
      </Box>
    </Box>
  );
}
