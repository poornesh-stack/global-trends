import { Box } from "@mui/material";

const drawerWidth = 240;
const appbarWidth = 70;

export default function Crypto() {
  return (
    <Box
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        mt: `${appbarWidth}px`,
      }}
    >
      <h1>Welcome to Crypto Page</h1>
    </Box>
  );
}
