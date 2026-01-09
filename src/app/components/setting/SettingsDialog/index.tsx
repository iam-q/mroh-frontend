"use client";

import {
  SettingsRow,
  SettingsView,
} from "@/app/components/setting/SettingsView";
import { useColorMode } from "@/app/components/ThemeProviderClient";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React from "react";
import { AccountDeleteDialog } from "../AccountDeleteDialog";

type SettingsDialogProps = {
  settingsOpen: boolean;
  settingsView: "general" | "account";
  setSettingsView: (view: "general" | "account") => void;
  onClose: () => void;
  profile: {
    id?: string;
    email?: string;
    username?: string;
  } | null;
};

export function SettingsDialog({
  settingsOpen,
  settingsView,
  setSettingsView,
  onClose,
  profile,
}: SettingsDialogProps) {
  const { mode, setMode, accentColor, setAccentColor } = useColorMode();
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const handleDeleteCancel = () => setDeleteOpen(false);

  return (
    <Dialog
      open={settingsOpen}
      onClose={onClose}
      aria-labelledby="settings-dialog-title"
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
        },
      }}
    >
      <DialogTitle id="settings-dialog-title" sx={{ display: "none" }}>
        Settings
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        <Box sx={{ display: "flex", minHeight: 360, height: "100%" }}>
          <Box
            sx={{
              width: 200,
              height: "100%",
              borderRight: "1px solid",
              borderColor: "divider",
              py: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                height: 40,
                px: 1,
              }}
            >
              <IconButton
                aria-label="Close settings"
                onClick={onClose}
                size="small"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            <List dense sx={{ pt: 1 }}>
              <ListItemButton
                selected={settingsView === "general"}
                onClick={() => setSettingsView("general")}
              >
                <ListItemText primary="General" />
              </ListItemButton>
              <ListItemButton
                selected={settingsView === "account"}
                onClick={() => setSettingsView("account")}
              >
                <ListItemText primary="Account" />
              </ListItemButton>
            </List>
          </Box>
          <Box
            sx={{
              flex: 1,
              px: 3,
              pb: 3,
            }}
          >
            {settingsView === "general" ? (
              <SettingsView title="General">
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <SettingsRow
                    left={
                      <Box>
                        <Typography variant="subtitle2">Appearance</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Choose how the app looks on this device.
                        </Typography>
                      </Box>
                    }
                    right={
                      <FormControl size="small" sx={{ minWidth: 220 }}>
                        <InputLabel id="appearance-select-label">
                          Theme
                        </InputLabel>
                        <Select
                          labelId="appearance-select-label"
                          value={mode}
                          label="Theme"
                          onChange={(event) =>
                            setMode(event.target.value as typeof mode)
                          }
                        >
                          <MenuItem value="system">System</MenuItem>
                          <MenuItem value="dark">Dark</MenuItem>
                          <MenuItem value="light">Light</MenuItem>
                        </Select>
                      </FormControl>
                    }
                  />
                  <Divider />
                  <SettingsRow
                    left={
                      <Box>
                        <Typography variant="subtitle2">
                          Accent color
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Customize highlights and buttons.
                        </Typography>
                      </Box>
                    }
                    right={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          component="input"
                          type="color"
                          aria-label="Accent color"
                          value={accentColor}
                          onChange={(event) =>
                            setAccentColor(event.target.value)
                          }
                          sx={{
                            width: 40,
                            height: 32,
                            p: 0,
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 1,
                            background: "transparent",
                            cursor: "pointer",
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {accentColor.toUpperCase()}
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
              </SettingsView>
            ) : (
              <SettingsView title="Account">
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <SettingsRow
                    left={
                      <Box>
                        <Typography variant="subtitle2">Username</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Your public handle.
                        </Typography>
                      </Box>
                    }
                    right={
                      <Typography variant="body2">
                        {profile?.username ?? "—"}
                      </Typography>
                    }
                  />
                  <Divider />
                  <SettingsRow
                    left={
                      <Box>
                        <Typography variant="subtitle2">Email</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Account email address.
                        </Typography>
                      </Box>
                    }
                    right={
                      <Typography variant="body2">
                        {profile?.email ?? "—"}
                      </Typography>
                    }
                  />
                  <Divider />
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}
                  >
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => setDeleteOpen(true)}
                    >
                      Delete account
                    </Button>
                  </Box>
                </Box>
              </SettingsView>
            )}
          </Box>
        </Box>
      </DialogContent>

      <AccountDeleteDialog
        open={deleteOpen}
        onCancel={handleDeleteCancel}
        onDeleted={() => {
          setDeleteOpen(false);
          onClose();
        }}
      />
    </Dialog>
  );
}
