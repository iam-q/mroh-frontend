"use client";

import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
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
          justifyContent: open ? "flex-start" : "center",
          alignItems: "center",
          px: open ? 2.5 : 0,
        }}
      >
        <IconButton
          onClick={handleDrawerToggle}
          size="small"
          sx={{
            color: "white",
            backgroundColor: "#1a1a1a",
            "&:hover": { backgroundColor: "#222222" },
            p: 0,
            width: 24,
            height: 24,
            ml: open ? -0.5 : 0,
          }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <Divider />
      <List sx={{ px: 0 }}>
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
          <ListItem
            key={item.text}
            disablePadding
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "flex-start" : "center",
                px: open ? 2.5 : 0,
                width: "100%",
              }}
              selected={item.path === pathname}
              onClick={() => router.push(item.path)}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 0,
                  width: 24,
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && <ListItemText primary={item.text} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
}
