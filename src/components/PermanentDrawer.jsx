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
  Chip,
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
import { alpha } from "@mui/material/styles";
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

  const isActive = (path) => location.pathname === path;

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          background: "linear-gradient(90deg, #000068 0%, #2626a5 100%)",
          color: "#fff",
          borderBottom: "1px solid rgba(255,255,255,0.18)",
          backdropFilter: "blur(6px)",
        }}
      >
        <Toolbar sx={{ minHeight: 70 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontFamily: '"Michroma", sans-serif',
              fontWeight: 500,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
              fontSize: "2rem",
            }}
          >
            Global Trends
          </Typography>

          <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
            <Button
              color="inherit"
              onClick={() => navigate("/about")}
              sx={{
                px: 2,
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 500,
                fontSize: "1rem",
                "&:hover": { backgroundColor: alpha("#ffffff", 0.15) },
              }}
            >
              About
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate("/contact")}
              sx={{
                px: 2,
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 500,
                fontSize: "1rem",
                "&:hover": { backgroundColor: alpha("#ffffff", 0.15) },
              }}
            >
              Contact
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "linear-gradient(180deg, #000068 0%, #07072e 100%)",
            color: "#ffffff",
            borderRight: "1px solid rgba(255,255,255,0.12)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            px: 2,
            py: 2.25,
          }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: "10px",
              background:
                "conic-gradient(from 180deg at 50% 50%, #72E7FF 0deg, #7B61FF 140deg, #00FFC6 320deg)",
              boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
            }}
          />
          <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontFamily: '"Michroma", sans-serif', fontWeight: 800 }}
            >
              Global Trends
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Insights at a glance
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.12)", mx: 2 }} />

        <List sx={{ px: 1, pt: 1 }}>
          {menuItem.map(({ text, icon, path }) => {
            const active = isActive(path);
            return (
              <ListItem key={text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(path)}
                  selected={active}
                  sx={{
                    position: "relative",
                    borderRadius: 2,
                    mx: 1,
                    py: 1,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: alpha("#FFFFFF", 0.08),
                      transform: "translateY(-1px)",
                    },
                    "&.Mui-selected": {
                      backgroundColor: alpha("#FFFFFF", 0.14),
                      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
                      "&:hover": {
                        backgroundColor: alpha("#FFFFFF", 0.18),
                      },
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: 6,
                      bottom: 6,
                      width: 4,
                      borderRadius: 4,
                      background: active
                        ? "linear-gradient(180deg, #00FFC6 0%, #7B61FF 100%)"
                        : "transparent",
                      transition: "background 0.2s ease",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 42,
                      color: "#ffffff",
                      opacity: active ? 1 : 0.9,
                      transform: active ? "scale(1.05)" : "none",
                      transition: "transform 0.2s ease, opacity 0.2s ease",
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    slotProps={{
                      primary: {
                        sx: {
                          fontWeight: active ? 700 : 500,
                          letterSpacing: 0.3,
                        },
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ px: 2, pb: 2, display: "grid", gap: 1 }}>
          <Chip
            label="Live"
            size="small"
            sx={{
              width: "fit-content",
              fontWeight: 700,
              color: "#001133",
              backgroundColor: "#72E7FF",
            }}
          />
          <Typography variant="caption" sx={{ opacity: 0.7, lineHeight: 1.4 }}>
            Data updates in real-time.
          </Typography>
        </Box>
      </Drawer>
    </Box>
  );
}
