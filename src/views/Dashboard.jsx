import { Box, Toolbar } from "@mui/material";
import PermanentDrawer from "../components/PermanentDrawer";
import TopBar from "../components/TopBar";

export default function Dashboard() {
  const drawerWidth = 5;

  return (
    <Box sx={{ display: "flex" }}>
      <PermanentDrawer />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${drawerWidth}px`,
        }}
      >
        <TopBar />
      </Box>
    </Box>
  );
}
