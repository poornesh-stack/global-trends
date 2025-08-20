import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
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

  useEffect(() => {
    loadGetApi();
  }, []);

  function loadGetApi() {
    axios
      .get(`https://api.coinlore.net/api/tickers/`)
      .then((res) => {
        console.log(res, "Crypto Data");
        // setListData(res .data);
      })
      .catch((err) => {
        Swal.fire("Error occurred while fetching the data", "", "error");
      });
  }

  return (
    <Box
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        mt: `${appbarWidth}px`,
      }}
    >
      {/* <h1>Welcome to Dashboard Page</h1> */}
      <Card sx={{ maxWidth: `calc(50% - 8px)`, ml: 2 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            Cryptocurrencies
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow
                  key={"header-key"}
                  // sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  {["#", "Name", "Price", "24h", "1h", "7d", "24h Market Cap", "24h Volume"].map(
                    (h) => (
                      <TableCell key={h}>{h}</TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody></TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
