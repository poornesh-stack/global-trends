import { Box } from "@mui/material";

const drawerWidth = 240;
const appbarWidth = 70;

export default function Weather() {
  return (
    <Box
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        mt: `${appbarWidth}px`,
      }}
    >
      <h1>Welcome to Weather Page</h1>
    </Box>
  );
}
