import { Box, CircularProgress, Typography } from "@mui/material";

export default function LoadingCard({ message = "Fetching data..." }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: 200,
      }}
    >
      <CircularProgress />
      <Typography sx={{ mt: 2 }}>{message}</Typography>
    </Box>
  );
}
