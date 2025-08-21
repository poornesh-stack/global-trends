import {
  Box,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const drawerWidth = 240;
const appbarWidth = 70;

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
            Cryptocurrencies
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 2, height: 350 }} elevation="0">
            <Table stickyHeader>
              <TableHead>
                <TableRow
                  key={"header-key"}
                  // sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  {["#", "Name", "Price", "24h", "1h", "7d", "24h Market Cap", "24h Volume"].map(
                    (h) => (
                      <TableCell key={h} lign="center" sx={{ fontWeight: "bold", borderBottom: 1 }}>
                        {h}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {listData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((coin, index) => {
                    const getChangeColor = (value) => (parseFloat(value) >= 0 ? "green" : "red");

                    return (
                      <TableRow key={coin.id} hover>
                        <TableCell align="center" sx={{ borderBottom: "none" }}>
                          {page * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell align="center" sx={{ borderBottom: "none" }}>
                          {coin.name}
                        </TableCell>
                        <TableCell align="center" sx={{ borderBottom: "none" }}>
                          ${parseFloat(coin.price_usd).toFixed(2)}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: getChangeColor(coin.percent_change_24h),
                            borderBottom: "none",
                          }}
                        >
                          {coin.percent_change_24h}%
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: getChangeColor(coin.percent_change_1h),
                            borderBottom: "none",
                          }}
                        >
                          {coin.percent_change_1h}%
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: getChangeColor(coin.percent_change_7d),
                            borderBottom: "none",
                          }}
                        >
                          {coin.percent_change_7d}%
                        </TableCell>
                        <TableCell align="center" sx={{ borderBottom: "none" }}>
                          ${parseFloat(coin.market_cap_usd).toLocaleString()}
                        </TableCell>
                        <TableCell align="center" sx={{ borderBottom: "none" }}>
                          ${parseFloat(coin.volume24).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={listData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </CardContent>
      </Card>

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
            Bitcoin Price History
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ maxWidth: `calc(50% - 8px)`, ml: 2, maxHeight: 500 }}>
        <CardContent>
          <h1>Card 3</h1>
        </CardContent>
      </Card>
    </Box>
  );
}
