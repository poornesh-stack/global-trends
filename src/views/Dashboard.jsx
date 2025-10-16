import { Box, Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import CryptoChartDashboard from "../components/CryptoChartDashboard";
import WeatherDashboard from "../components/WeatherDashboard";
import CurrencyDashboard from "../components/CurrencyDashboard";

const drawerWidth = 240;
const appbarWidth = 85;

export default function Dashboard() {
  return (
    <Box
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        mt: `${appbarWidth}px`,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
        pb: 3,
      }}
    >
      <Stack direction="row" gap={2} sx={{ width: "98%" }}>
        <Card
          sx={{
            width: "50%",
            borderRadius: 3,
            boxShadow: 1,
          }}
        >
          <CardContent>
            <Typography variant="h5" sx={{ opacity: 0.75, mb: 1 }}>
              Cypto Currency Trends
            </Typography>
            <Divider sx={{ mb: 4 }} />
            <CryptoChartDashboard />
          </CardContent>
        </Card>

        <Card
          sx={{
            width: "50%",
            borderRadius: 3,
            boxShadow: 1,
          }}
        >
          <CardContent>
            <Typography variant="h5" sx={{ opacity: 0.75, mb: 1 }}>
              USD vs INR (select ranges in chart)
            </Typography>
            <CurrencyDashboard currency1="usd" currency2="inr" />
          </CardContent>
        </Card>
      </Stack>

      <Card
        sx={{
          width: "98%",
          borderRadius: 3,
          boxShadow: 1,
        }}
      >
        <CardContent>
          <WeatherDashboard />
        </CardContent>
      </Card>
    </Box>
  );
}
