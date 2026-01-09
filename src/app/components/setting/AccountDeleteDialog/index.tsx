"use client";

import { apiUrl } from "@/app/utils/api";
import { useProfileStore } from "@/app/utils/store/profileStore";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

export function AccountDeleteDialog({
  open,
  onCancel,
  onDeleted,
}: {
  open: boolean;
  onCancel: () => void;
  onDeleted: () => void;
}) {
  const [confirmName, setConfirmName] = React.useState("");
  const clearProfile = useProfileStore((state) => state.clearProfile);
  const setProfile = useProfileStore((state) => state.setProfile);
  const profile = useProfileStore((state) => state.profile);
  const router = useRouter();

  React.useEffect(() => {
    if (!open) {
      setConfirmName("");
    }
  }, [open]);

  React.useEffect(() => {
    if (!open || profile) return;

    const loadProfile = async () => {
      try {
        const response = await fetch(apiUrl("/user/profile"), {
          method: "GET",
          credentials: "include",
        });

        if (response.status === 401 || response.status === 403) {
          console.warn("Token expired or invalid. Redirecting to login...");
          clearProfile();
          router.push("/login");
          return;
        }

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Profile load failed: ${error}`);
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error("Profile load error:", err);
      }
    };

    loadProfile();
  }, [open, profile, clearProfile, setProfile, router]);

  const expectedName = profile?.username?.trim() ?? "";
  const isConfirmMatch =
    expectedName.length > 0 && confirmName.trim() === expectedName;

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(apiUrl("/user/"), {
        method: "DELETE",
        credentials: "include",
      });

      if (response.status === 401 || response.status === 403) {
        console.warn("Token expired or invalid. Redirecting to login...");
        clearProfile();
        router.push("/login");
        return;
      }

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Delete account failed: ${error}`);
      }

      clearProfile();
      onDeleted();
      router.push("/login");
    } catch (err) {
      console.error("Delete account error:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Delete account?</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          This will permanently delete your account and all associated data.
          This action cannot be undone.
        </Typography>
        <TextField
          label="Type your username to confirm"
          value={confirmName}
          onChange={(event) => setConfirmName(event.target.value)}
          size="small"
          fullWidth
          helperText={
            expectedName
              ? `Type "${expectedName}" to confirm.`
              : "No username found."
          }
          sx={{ mt: 2 }}
        />
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}
        >
          <Button onClick={onCancel} size="small">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleDeleteAccount}
            disabled={!isConfirmMatch}
          >
            Delete
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
