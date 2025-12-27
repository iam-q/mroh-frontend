"use client";

import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  Toolbar,
  Typography,
} from "@mui/material";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AccountManager } from "../Navbar/AccountManager";
import DrawerContent from "../Navbar/DrawerContent";
import "./MainLayout.css";

const drawerWidth = 240;
const miniDrawerWidth = 64;
const loginPath = "/login";
const signupPath = "/signup";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const drawerOpen = pathname !== loginPath && pathname !== signupPath;
  const [open, setOpen] = useState(drawerOpen);

  useEffect(() => {
    setOpen(drawerOpen);
  }, [pathname]);

  const handleDrawerToggle = () => {
    if (drawerOpen) {
      setOpen(!open);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />

      {/* Drawer and main content wrapper */}
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        {/* Drawer */}
        <Drawer
          variant="persistent"
          open={drawerOpen}
          sx={{
            width: open ? drawerWidth : miniDrawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: open ? drawerWidth : miniDrawerWidth,
              boxSizing: "border-box",
              position: "fixed",
              height: "100vh",
              overflow: "hidden",
              transition: "width 0.3s ease-in-out",
              background:
                "linear-gradient(135deg, #1a1a1a, #222222, #2a2a2a, #1f1f1f)",
              backgroundSize: "400% 400%",
              animation: "gradientShift 15s ease infinite",
              color: "white",
            },
          }}
        >
          <DrawerContent open={open} handleDrawerToggle={handleDrawerToggle} />
        </Drawer>
        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: "hidden",
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {drawerOpen && (
            <AppBar
              position="sticky"
              elevation={0}
              sx={{
                backgroundColor: "#ffffff",
                color: "inherit",
                borderBottom: "1px solid #e0e0e0",
                zIndex: 1100,
              }}
            >
              <Toolbar
                sx={{
                  display: "flex",
                  gap: 1,
                  minHeight: 48,
                  px: 2,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    letterSpacing: 1,
                    fontSize: "1.2rem",
                  }}
                >
                  MR&lt;/&gt;H
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <AccountManager />
              </Toolbar>
            </AppBar>
          )}

          <Box sx={{ flexGrow: 1 }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
}
