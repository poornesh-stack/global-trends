import { Box, Card, CardContent, Typography } from "@mui/material";
import Currency from "./Currency";

const drawerWidth = 240;
const appbarWidth = 70;

function CardComponent({ title, content }) {
  return (
    <Card sx={{ maxWidth: `calc(50% - 8px)`, ml: 2, mt: 1, maxHeight: 500 }}>
      <CardContent>
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontFamily: "sans-serif",
            fontWeight: 500,
            letterSpacing: ".1rem",
            color: "inherit",
            textDecoration: "none",
            mb: 2,
          }}
        >
          {title}
        </Typography>
        {content}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  return (
    <Box
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        mt: `${appbarWidth}px`,
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      <CardComponent title="Crypto Trends" />

      <Currency />

      <CardComponent title="Weather Trends" />
    </Box>
  );
}
