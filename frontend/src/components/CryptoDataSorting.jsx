import { Box, Typography } from "@mui/material";
import StatisticsButton from "../utils/StatisticsButton";
import CryptoTop10Chart from "./CryptoTop10Chart";

export default function CryptoDataSorting({ data = [] }) {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography variant="h6">Crypto Real-Time Trend</Typography>
        <StatisticsButton data={data} />
      </Box>

      <CryptoTop10Chart data={data} />
    </Box>
  );
}
