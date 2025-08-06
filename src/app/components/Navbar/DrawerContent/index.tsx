"use client";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import HomeIcon from "@mui/icons-material/Home";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { AccountManager } from "../AccountManager";

type DrawerContentType = {
  open: boolean;
  handleDrawerToggle: () => void;
};

export default function DrawerContent({
  open,
  handleDrawerToggle,
}: DrawerContentType) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <Typography fontWeight="bold" fontSize={30}>
          MR&lt;/&gt;H
        </Typography>

        {/* ChevronLeftIcon */}
        <IconButton onClick={handleDrawerToggle}>
          <ChevronLeftIcon sx={{ color: "white" }} />
        </IconButton>
      </Toolbar>

      <Divider />
      <List>
        {[
          {
            text: "Home",
            icon: <HomeIcon sx={{ color: "white" }} />,
            path: "/",
          },
          // {
          //   text: "Products",
          //   icon: <InventoryIcon sx={{ color: "white" }} />,
          //   path: "/products",
          // },
          // {
          //   text: "Fraud Check",
          //   icon: <ManageSearchIcon sx={{ color: "white" }} />,
          //   path: "/fraud-check",
          // },
          // { text: "Apps", icon: <AppsIcon />, path: "/apps" },
          // { text: "Store", icon: <StoreIcon />, path: "/store" },
        ].map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
              selected={item.path === pathname}
              onClick={() => router.push(item.path)}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && <ListItemText primary={item.text} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Add Cart on the bottom above the account avatar */}
      <Box sx={{ flexGrow: 1 }} />

      <List>
        <ListItem disablePadding sx={{ display: "block" }}>
          <AccountManager />
          {/* <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
            }}
            selected={pathname === "/cart"}
            onClick={() => router.push("/cart")}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              <ShoppingCartIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Cart" />}
          </ListItemButton> */}
        </ListItem>
      </List>
    </>
  );
}
