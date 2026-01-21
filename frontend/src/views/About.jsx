import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import {
  CloudOutlined,
  AttachMoneyOutlined,
  CurrencyExchangeOutlined,
  ConstructionOutlined,
  AddCommentOutlined,
  RocketLaunchOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;
const appbarWidth = 70;

function SectionCard({ icon, title, children }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        backdropFilter: "blur(2px)",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
        {icon}
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
      </Stack>
      <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
        {children}
      </Typography>
    </Paper>
  );
}

export default function About() {
  const navigate = useNavigate();

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
        mb: 4,
      }}
    >
      <Card
        sx={{
          width: "98%",
          mt: 2,
          borderRadius: 3,
          boxShadow: 0,
          background:
            "linear-gradient(135deg, rgba(0,0,104,1) 0%, rgba(0,0,104,0.85) 35%, rgba(0,0,0,0.85) 100%)",
          color: "#fff",
        }}
      >
        <CardContent sx={{ py: 5 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
            spacing={3}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, letterSpacing: ".02em", lineHeight: 1.2 }}
              >
                About Global Trends
              </Typography>
              <Typography
                sx={{
                  mt: 1.5,
                  opacity: 0.95,
                  maxWidth: 900,
                  lineHeight: 1.75,
                }}
              >
                Hi! I’m Poornesh Suresh, this project combines live weather updates, real-time
                cryptocurrency data, and global currency trends into one sleek, interactive
                dashboard.
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ width: "98%" }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 3,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Why I Built This
          </Typography>
          <Typography sx={{ color: "text.secondary", lineHeight: 1.8 }}>
            Beyond the basics, it offers detailed insights into currency movements, dynamic graphs
            showcasing live crypto prices, and highlights of leading market performers. It’s
            designed to help new investors make smarter decisions about where to invest their money.
            In the near future, this platform will expand to include the latest global trends from
            breaking news and financial updates to live sports scores and more. The goal is simple:
            To make everyday data quick to access, visually engaging, and easy to understand In One
            Place.
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 3,
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            What’s Inside
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <SectionCard
                icon={<AttachMoneyOutlined sx={{ color: "primary.main" }} />}
                title="Crypto Currency (Realtime)"
              >
                Stay on top of the crypto market with live price tracking, top gainers and losers,
                and interactive charts that update in real time. Whether you’re a casual observer or
                an active trader, this feature gives you a clear, visual snapshot of the market
                which is updated continuously for accuracy and insight.
              </SectionCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <SectionCard
                icon={<CurrencyExchangeOutlined sx={{ color: "primary.main" }} />}
                title="Currency Converter & Trends"
              >
                Convert between major currencies and visualize historical exchange rates with an
                intuitive, responsive interface. Clean inputs and time-range controls make it simple
                to explore trends and compare values across time.
              </SectionCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <SectionCard
                icon={<CloudOutlined sx={{ color: "primary.main" }} />}
                title="Weather Forecast & Air Quality"
              >
                Get current weather conditions, a 7-day forecast, wind direction, and air quality
                index. The built-in search supports quick lookups so just type and hit Enter for
                instant results.
              </SectionCard>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  height: "85%",
                  borderRadius: 3,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <Stack spacing={1}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <ConstructionOutlined sx={{ color: "primary.main" }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Tools I Used
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ pt: 1 }}>
                    <Chip label="React JS" size="small" />
                    <Chip label="Material UI" size="small" />
                    <Chip label="amCharts 5" size="small" />
                    <Chip label="RESTful APIs" size="small" />
                    <Chip label="CoinLore API" size="small" />
                    <Chip label="Weather API" size="small" />
                    <Chip label="Currency API" size="small" />
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={2} sx={{ mt: 1, flexWrap: "wrap" }}>
                  <Button
                    startIcon={<RocketLaunchOutlined />}
                    variant="contained"
                    sx={{ boxShadow: "none" }}
                    onClick={() => navigate("/")}
                  >
                    Explore the Dashboard
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Paper>

        {/* <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 3,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            mt: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Any Suggestions?
          </Typography>
          <Typography sx={{ color: "text.secondary", lineHeight: 1.8 }}>
            Got a cool feature in mind or spotted something to improve? Drop your thoughts, I’m
            always open to fresh ideas!
          </Typography>

          <Button
            startIcon={<AddCommentOutlined />}
            variant="contained"
            sx={{ boxShadow: "none", mt: 2 }}
            onClick={() =>
              window.open(
                "https://github.com/poornesh-stack/global-trends",
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            Suggestions
          </Button>
        </Paper> */}
      </Box>
    </Box>
  );
}
