import {
  CurrencyBitcoin,
  CurrencyExchange,
  Dashboard,
  ShowChart,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";

export default function PermanentDrawer() {
  const drawerWidth = 240;
  const navItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    { text: "Cryptocurrencies", icon: <CurrencyBitcoin /> },
    { text: "Stocks", icon: <ShowChart /> },
    { text: "Converter", icon: <CurrencyExchange /> },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: " #222",
            color: " #fff",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Box sx={{ px: 2, mb: 2 }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontFamily: "sans-serif",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            MarketPulse
          </Typography>
        </Box>
        <List>
          {navItems.map(({ text, icon, path }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                component={NavLink}
                to={path || "#"}
                className={({ isActive }) => (isActive ? "active" : "")}
                // sx={{
                //   "&.active": {
                //     backgroundColor: "rgba(255, 255, 255, 0.2)",
                //   },
                // }}
              >
                <ListItemIcon sx={{ color: "#fff" }}>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
