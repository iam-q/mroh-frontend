"use client";

import { useProfileStore } from "@/app/utils/store/profileStore";
import { apiUrl } from "@/app/utils/api";
import { Logout } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  MenuItem,
  MenuList,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

export function AccountManager() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const router = useRouter();
  const profile = useProfileStore((state) => state.profile);
  const avatarInitial =
    profile?.username?.trim()?.charAt(0)?.toUpperCase() ?? "?";

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function logout() {
    try {
      const response = await fetch(apiUrl("/user/logout"), {
        method: "POST",
        credentials: "include",
      });

      // If the token is expired or invalid (e.g. 401), still redirect to login
      if (response.status === 401 || response.status === 403) {
        console.warn("Token expired or invalid. Redirecting to login...");
        router.push("/login");
        return;
      }

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Logout failed: ${error}`);
      }

      handleClose();
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      // Fallback redirect just in case
      router.push("/login");
    }
  }

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ p: 0, display: "flex", alignItems: "center" }}>
      <Box display="flex" justifyContent="start">
        <IconButton onClick={handleClick} size="small">
          <Avatar
            alt={profile?.username}
            // src={[0].image}
            sx={{
              bgcolor: "#1976d2",
              width: 32,
              height: 32,
              fontSize: "0.9rem",
            }}
          >
            {avatarInitial}
          </Avatar>
        </IconButton>
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Stack direction="column" spacing={1} p={1} minWidth={200}>
          <Typography variant="body2" px={1}>
            Accounts
          </Typography>
          <MenuList dense>
            <MenuItem key={profile?.id} sx={{ gap: 1 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: "0.95rem",
                  bgcolor: "#1976d2",
                }}
              >
                {avatarInitial}
              </Avatar>
              <Box>
                <Typography variant="body2">{profile?.username}</Typography>
                <Typography variant="caption">{profile?.email}</Typography>
              </Box>
            </MenuItem>

            <MenuItem sx={{ gap: 1 }}>Settings</MenuItem>
            <MenuItem sx={{ gap: 1 }}>Donations</MenuItem>
          </MenuList>
          <Divider />
          <MenuItem sx={{ gap: 1 }} onClick={logout}>
            <Logout fontSize="small" />
            <Typography variant="body2">Sign out</Typography>
          </MenuItem>
        </Stack>
      </Popover>
    </Box>
  );
}
