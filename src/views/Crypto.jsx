import {
  Box,
  Card,
  CardContent,
  Divider,
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
import LoadingCard from "../utils/LoadingCard";
import CryptoDataSorting from "../components/CryptoDataSorting";

const drawerWidth = 240;
const appbarWidth = 70;

function formatLargeNumber(value) {
  const num = Number(value);
  if (isNaN(num)) return value;

  if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
}

const columns = [
  { id: "name", label: "Asset", minWidth: 170 },
  {
    id: "price_usd",
    label: "Price (USD)",
    minWidth: 100,
    format: (value) => `$${parseFloat(value).toFixed(2)}`,
  },
  {
    id: "percent_change_24h",
    label: "Change (24h)",
    minWidth: 100,
    format: (value) => `${parseFloat(value).toFixed(2)}%`,
  },
  {
    id: "market_cap_usd",
    label: "Mkt Cap (USD)",
    minWidth: 100,
    format: (value) => formatLargeNumber(value),
  },
  {
    id: "volume24",
    label: "Volume (24h)",
    minWidth: 100,
    format: (value) => formatLargeNumber(value),
  },
];

export default function Crypto() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [cryptodata, setCryptoData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefresing] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    getCryptoCurrency();
    const interval = setInterval(() => {
      getCryptoCurrency(true);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  function getCryptoCurrency(isAutoRefresh = false) {
    if (isAutoRefresh) {
      setIsRefresing(true);
    } else {
      setIsLoading(true);
    }
    axios
      .get(`https://api.coinlore.net/api/tickers/`)
      .then((res) => {
        console.log(res.data, "Crypto Data");
        const dataArray = res?.data?.data;
        if (Array.isArray(dataArray)) {
          setCryptoData(dataArray);
        } else {
          Swal.fire("Unexpected API response format.", "", "error");
        }
      })
      .catch((err) => {
        Swal.fire("Error fetching crypto data.", "", "error");
      })
      .finally(() => {
        if (isAutoRefresh) {
          setIsRefresing(false);
        } else {
          setIsLoading(false);
        }
      });
  }

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
      }}
    >
      <Card sx={{ width: "98%", mt: 2, boxShadow: "none" }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 25 }}>
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
              Crypto Currency
            </Typography>
          </Box>

          <Divider sx={{ color: "#333333", mt: 2 }} />
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", width: "98%", mb: 2 }}>
        <Paper sx={{ flex: 1, minWidth: "300px", boxShadow: 1 }}>
          {isLoading ? (
            <LoadingCard />
          ) : (
            <>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(cryptodata) &&
                      cryptodata
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => (
                          <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                            {columns.map((column) => {
                              const value = row[column.id];
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {column.format && value !== undefined
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={cryptodata.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Paper>

        <Card sx={{ flex: 1, minWidth: "300px", boxShadow: 1 }}>
          <CardContent>
            <CryptoDataSorting data={cryptodata} />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
