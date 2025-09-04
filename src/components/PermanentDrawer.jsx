import {
  AttachMoneyOutlined,
  CloudOutlined,
  CurrencyExchangeOutlined,
  DashboardOutlined,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 240;

const menuItem = [
  { text: "Dashboard", icon: <DashboardOutlined />, path: "/" },
  { text: "Crypto", icon: <AttachMoneyOutlined />, path: "/crypto" },
  { text: "Currency", icon: <CurrencyExchangeOutlined />, path: "/currency" },
  { text: "Weather", icon: <CloudOutlined />, path: "/weather" },
];

export default function PermanentDrawer() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          backgroundColor: "#000053",
        }}
      >
        <Toolbar>
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
            }}
          >
            Global Trends
          </Typography>
          <div style={{ marginLeft: "auto" }}>
            <Button color="inherit">About</Button>
            <Button color="inherit">Contact</Button>
            <Button color="inherit">Login</Button>
          </div>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#000068",
            color: "#ffffff",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            height: 32,
            padding: 2,
            overflow: "visible",
          }}
        ></Box>
        <Divider sx={{ backgroundColor: "#ffffff" }} />
        <List>
          {menuItem.map(({ text, icon, path }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                onClick={() => navigate(path)}
                selected={location.pathname === path}
                sx={{
                  "&:hover": { backgroundColor: "#6a6a6a" },
                  "&.Mui-selected": { backgroundColor: "#000000", fontWeight: "bold" },
                }}
              >
                <ListItemIcon sx={{ color: "#ffffff" }}>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
