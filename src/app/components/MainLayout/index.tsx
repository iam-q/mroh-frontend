"use client";

import MenuIcon from "@mui/icons-material/Menu";
import { Box, CssBaseline, Drawer } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import DrawerContent from "../Navbar/DrawerContent";
import "./MainLayout.css";

const drawerWidth = 240;
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
          open={open}
          sx={{
            width: open ? drawerWidth : 0,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              position: "fixed",
              height: "100vh",
              overflow: "hidden",
              transform: open
                ? "translateX(0)"
                : `translateX(-${drawerWidth}px)`,
              transition: "transform 0.3s ease-in-out",
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
          }}
        >
          {/* Show MenuIcon when drawer is closed */}
          {!open && drawerOpen && (
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                zIndex: 1200,
                color: "black",
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {children}
        </Box>
      </Box>
    </Box>
  );
}
