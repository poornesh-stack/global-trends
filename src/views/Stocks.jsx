import { Box } from "@mui/material";

const drawerWidth = 240;
const appbarWidth = 70;

export default function Stocks() {
  return (
    <Box
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        mt: `${appbarWidth}px`,
      }}
    >
      <h1>Welcome to Stocks Page</h1>
    </Box>
  );
}
