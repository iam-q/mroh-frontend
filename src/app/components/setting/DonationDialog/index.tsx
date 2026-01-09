"use client";

import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import Checkout from "../../Checkout";

type DonationDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function DonationDialog({ open, onClose }: DonationDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="donation-dialog-title"
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
        },
      }}
    >
      <DialogTitle
        id="donation-dialog-title"
        sx={{ display: "flex", alignItems: "center", pr: 1 }}
      >
        <Typography variant="h6" sx={{ flex: 1 }}>
          Donation
        </Typography>
        <IconButton aria-label="Close donations" onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Checkout />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" size="small">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
