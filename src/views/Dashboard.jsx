import { Box, Card, CardContent, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const drawerWidth = 240;
const appbarWidth = 70;

function CardComponent({ title }) {
  return (
    <Card sx={{ maxWidth: `calc(50% - 8px)`, ml: 2, maxHeight: 500 }}>
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
          }}
        >
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    loadGetApi();

    const interval = setInterval(() => {
      loadGetApi();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  function loadGetApi() {
    axios
      .get(`https://api.coinlore.net/api/tickers/`)
      .then((res) => {
        console.log(res, "Crypto Data");
        setListData(res.data.data);
      })
      .catch((err) => {
        Swal.fire("Error occurred while fetching the data", "", "error");
      });
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
      <CardComponent title="Currency Converter" />
      <CardComponent title="Weather Trends" />
    </Box>
  );
}
