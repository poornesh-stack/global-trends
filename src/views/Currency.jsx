import {
  Box,
  Card,
  CardContent,
  Divider,
  InputBase,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import CurrencyLineGraph from "../components/CurrencyLineGraph";
import LoadingCard from "../utils/LoadingCard";

const drawerWidth = 240;
const appbarWidth = 70;

export default function Currency() {
  const [currencies, setCurrencies] = useState([]);
  const [rates, setRates] = useState({});

  const [currency1, setCurrency1] = useState("usd");
  const [currency2, setCurrency2] = useState("inr");

  const [amount1, setAmount1] = useState(1);
  const [amount2, setAmount2] = useState("");

  const [activeInput, setActiveInput] = useState("amount1");

  const [loading, setLoading] = useState({ names: true, rates: true });
  const hasLoadedOnce = useRef(false);

  const allowedCurrencies = [
    "afn",
    "all",
    "dzd",
    "aoa",
    "ars",
    "amd",
    "aud",
    "azm",
    "bsd",
    "bhd",
    "bdt",
    "byn",
    "btn",
    "bob",
    "bwp",
    "brl",
    "bgn",
    "bif",
    "xpf",
    "cad",
    "cve",
    "cny",
    "cnh",
    "kmf",
    "cdf",
    "crc",
    "cup",
    "czk",
    "dkk",
    "djf",
    "dop",
    "xcd",
    "egp",
    "etb",
    "eur",
    "fjd",
    "gmd",
    "gel",
    "ghs",
    "gtq",
    "gnf",
    "gyd",
    "htg",
    "hnl",
    "hkd",
    "huf",
    "isk",
    "inr",
    "idr",
    "irr",
    "iqd",
    "jmd",
    "jpy",
    "jod",
    "kzt",
    "kes",
    "kwd",
    "lbp",
    "lrd",
    "lyd",
    "mkd",
    "mga",
    "mwk",
    "myr",
    "mvr",
    "mro",
    "mur",
    "mxn",
    "mdl",
    "mad",
    "mzm",
    "nad",
    "npr",
    "nzd",
    "nio",
    "ngn",
    "nok",
    "omr",
    "pkr",
    "pab",
    "pgk",
    "pyg",
    "php",
    "pln",
    "rol",
    "rub",
    "rwf",
    "svc",
    "rsd",
    "scr",
    "sle",
    "sgd",
    "sol",
    "sbd",
    "sos",
    "zar",
    "krw",
    "xdr",
    "lkr",
    "sdg",
    "srd",
    "szl",
    "sek",
    "chf",
    "tjs",
    "tzs",
    "thb",
    "tnd",
    "try",
    "tmm",
    "ugx",
    "uah",
    "aed",
    "usd",
    "uyu",
    "uzs",
    "vnd",
    "yer",
    "zmk",
  ];

  const currency1Name =
    currencies.find((c) => c.code === currency1)?.name || currency1.toUpperCase();
  const currency2Name =
    currencies.find((c) => c.code === currency2)?.name || currency2.toUpperCase();

  const formatNumber = (value) => {
    if (isNaN(value) || value === "") return "";
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  useEffect(() => {
    loadGetCurrencyName();
  }, []);

  useEffect(() => {
    loadGetCurrencyRate();

    const interval = setInterval(() => {
      loadGetCurrencyName();
    }, 60000);

    return () => clearInterval(interval);
  }, [currency1]);

  useEffect(() => {
    if (!hasLoadedOnce.current && !loading.names && !loading.rates) {
      hasLoadedOnce.current = true;
    }
  }, [loading]);

  useEffect(() => {
    if (!currency1 || !currency2 || !rates[currency2]) return;

    if (activeInput === "amount1") {
      setAmount2((amount1 * rates[currency2]).toFixed(2));
    } else if (activeInput === "amount2") {
      setAmount1((amount2 / rates[currency2]).toFixed(2));
    }
  }, [amount1, amount2, currency1, currency2, rates, activeInput]);

  function loadGetCurrencyName() {
    setLoading((prev) => ({ ...prev, names: true }));
    axios
      .get(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json`)
      .then((res) => {
        console.log(res.data, "Currency Name");
        const currencyList = Object.entries(res.data).map(([code, name]) => ({
          code,
          name,
        }));
        setCurrencies(currencyList);
        setLoading((prev) => ({ ...prev, names: false }));
      })
      .catch((err) => {
        setLoading((prev) => ({ ...prev, names: false }));
        Swal.fire("Error fetching Currency Names.", "", "error");
      });
  }

  function loadGetCurrencyRate() {
    setLoading((prev) => ({ ...prev, rates: true }));
    axios
      .get(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency1}.json`
      )
      .then((res) => {
        console.log(res.data, "Currency Rates");
        setRates(res.data[currency1]);
        setLoading((prev) => ({ ...prev, rates: false }));
      })
      .catch((err) => {
        setLoading((prev) => ({ ...prev, rates: false }));
        Swal.fire("Error fetching Currency Rates.", "", "error");
      });
  }

  const showInitialLoader = !hasLoadedOnce.current && (loading.names || loading.rates);

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
        mb: 3,
      }}
    >
      <Card sx={{ width: "98%", mt: 2, boxShadow: 0 }}>
        <CardContent>
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontFamily: '"Italianno", cursive',
              fontWeight: 500,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
              mb: 1,
              fontSize: "3rem",
            }}
          >
            Currency Converter and Trends
          </Typography>

          <Divider sx={{ color: "#333333", mb: 2 }} />
        </CardContent>
      </Card>

      {showInitialLoader ? (
        <Card sx={{ width: "98%", boxShadow: 1 }}>
          <CardContent>
            <LoadingCard message="Loading Currencies & Rates..." />
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", width: "98%" }}>
          <Card sx={{ flex: 1, minWidth: "300px", boxShadow: 1 }}>
            <CardContent>
              <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ justifyItems: "center" }}>
                    <Typography
                      variant="subtitle1"
                      component="div"
                      sx={{
                        fontFamily: `"Shadows Into Light"`,
                        fontWeight: 400,
                        fontSize: "2.6rem",
                        color: "text.primary",
                        mb: 1,
                        textAlign: "center",
                        lineHeight: 1.7,
                        letterSpacing: ".05rem",
                      }}
                    >
                      {formatNumber(amount1)} {currency1Name} equals{" "}
                      <Box
                        component="div"
                        sx={{
                          fontFamily: `"Shadows Into Light"`,
                          fontWeight: 400,
                          fontSize: "2.6rem",
                          color: "secondary.main",
                          letterSpacing: ".04rem",
                        }}
                      >
                        {formatNumber(amount2)} {currency2Name}
                      </Box>
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid #444444",
                        borderRadius: 2,
                        overflow: "hidden",
                        width: "350px",
                      }}
                    >
                      <Box sx={{ width: "150px" }}>
                        <InputBase
                          value={amount1}
                          onChange={(e) => {
                            setAmount1(e.target.value);
                            setActiveInput("amount1");
                          }}
                          sx={{
                            px: 2,
                            py: 1,
                            flex: 1,
                            color: "inherit",
                            input: { textAlign: "left" },
                          }}
                        />
                      </Box>
                      <Divider orientation="vertical" flexItem sx={{ color: "black", my: 0.5 }} />
                      <Select
                        value={currency1}
                        onChange={(e) => setCurrency1(e.target.value)}
                        sx={{
                          flex: 1,
                          color: "inherit",
                          ml: 1,
                          "& .MuiSelect-icon": { color: "#aaa" },
                          "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                          backgroundColor: "transparent",
                          textAlign: "right",
                        }}
                        variant="standard"
                        disableUnderline
                      >
                        {currencies
                          .filter((c) => allowedCurrencies.includes(c.code))
                          .map((c) => (
                            <MenuItem key={c.code} value={c.code}>
                              {c.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid #444444",
                        borderRadius: 2,
                        overflow: "hidden",
                        width: "350px",
                      }}
                    >
                      <Box sx={{ width: "150px" }}>
                        <InputBase
                          value={amount2}
                          onChange={(e) => {
                            setAmount2(e.target.value);
                            setActiveInput("amount2");
                          }}
                          sx={{
                            px: 2,
                            py: 1,
                            flex: 1,
                            color: "inherit",
                            input: { textAlign: "left" },
                          }}
                        />
                      </Box>
                      <Divider orientation="vertical" flexItem sx={{ color: "black", my: 0.5 }} />
                      <Select
                        value={currency2}
                        onChange={(e) => setCurrency2(e.target.value)}
                        sx={{
                          flex: 1,
                          color: "inherit",
                          ml: 1,
                          "& .MuiSelect-icon": { color: "#aaa" },
                          "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                          backgroundColor: "transparent",
                          textAlign: "right",
                        }}
                        variant="standard"
                        disableUnderline
                      >
                        {currencies
                          .filter((c) => allowedCurrencies.includes(c.code))
                          .map((c) => (
                            <MenuItem key={c.code} value={c.code}>
                              {c.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    flexWrap: "wrap",
                    display: "flex",
                  }}
                >
                  <CurrencyLineGraph currency1={currency1} currency2={currency2} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
}
