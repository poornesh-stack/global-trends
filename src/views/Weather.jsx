import { AirOutlined, SearchOutlined, WaterDropOutlined } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import WeatherAqiGauge from "../components/WeatherAqiGauge";
import LoadingCard from "../utils/LoadingCard";
import WeatherCompassChart from "../components/WeatherCompassChart";

const drawerWidth = 240;
const appbarWidth = 70;

function stripDecimalsFromObject(obj) {
  if (Array.isArray(obj)) {
    return obj.map(stripDecimalsFromObject);
  } else if (typeof obj === "object" && obj !== null) {
    const cleaned = {};
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === "number") {
        cleaned[key] = parseInt(value);
      } else {
        cleaned[key] = stripDecimalsFromObject(value);
      }
    }
    return cleaned;
  } else {
    return obj;
  }
}

export default function Weather() {
  const theme = useTheme();
  const [currentWeather, setCurrentWeather] = useState([]);
  const [forecastWeather, setForecastWeather] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [tempUnit, setTempUnit] = useState("C");
  const [windUnit, setWindUnit] = useState("kmph");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    getWeatherData("bangalore");
  }, []);

  function getWeatherData(query = "bangalore") {
    axios
      .get(
        `http://api.weatherapi.com/v1/forecast.json?key=3c788fcae868481b8f065541252909&q=${query}&days=7&aqi=yes&alerts=yes`
      )
      .then((res) => {
        console.log(res.data, "Weather Data");
        const cleanedData = stripDecimalsFromObject(res.data);
        setCurrentWeather(cleanedData);
        setForecastWeather(cleanedData.forecast);
      })
      .catch((err) => {
        Swal.fire("Error fetching weather data.", "", "error");
      });
  }

  const debounceRef = useRef();

  function fetchSuggestions(query) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      axios
        .get(
          `http://api.weatherapi.com/v1/search.json?key=3c788fcae868481b8f065541252909&q=${query}`
        )
        .then((res) => setSuggestions(res.data))
        .catch(() => setSuggestions([]));
    }, 250);
  }

  const handleSearchChange = (event, newInputValue) => {
    if (newInputValue !== undefined && newInputValue !== null) {
      setSearchInput(newInputValue);
      fetchSuggestions(newInputValue);
    }
  };

  const handleSelect = (event, value) => {
    if (!value) return;

    if (typeof value === "string") {
      const q = value.trim();
      if (q) getWeatherData(q);
      return;
    }

    if (value.name) {
      getWeatherData(value.name);
      return;
    }
  };

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
              Weather Forecast
            </Typography>

            <Autocomplete
              freeSolo
              inputValue={searchInput}
              onChange={handleSelect}
              onInputChange={handleSearchChange}
              options={suggestions}
              filterOptions={(x) => x}
              getOptionLabel={(option) =>
                typeof option === "string"
                  ? option
                  : [option?.name, option?.region, option?.country].filter(Boolean).join(", ")
              }
              isOptionEqualToValue={(opt, val) =>
                (opt?.id ?? `${opt?.name}-${opt?.region}-${opt?.country}`) ===
                (val?.id ?? `${val?.name}-${val?.region}-${val?.country}`)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search City or Zip Code"
                  variant="outlined"
                  fullWidth
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const q = (searchInput || "").trim();
                      if (q) getWeatherData(q);
                    }
                  }}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchOutlined />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              sx={{
                width: "90%",
                [theme.breakpoints.up("sm")]: { width: "50%" },
                [theme.breakpoints.up("md")]: { width: "30%" },
              }}
            />
          </Box>

          <Divider sx={{ color: "#333333", mt: 2 }} />
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", width: "98%" }}>
        <Card sx={{ flex: 1, minWidth: "300px", boxShadow: 1 }}>
          <CardContent>
            {currentWeather?.location ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  }}
                >
                  <Typography variant="h6">
                    {currentWeather.location.name}, {currentWeather.location.region}
                  </Typography>

                  <ButtonGroup variant="outlined" size="small">
                    <Button
                      onClick={() => setTempUnit("C")}
                      variant={tempUnit === "C" ? "contained" : "outlined"}
                      sx={{
                        color: tempUnit === "C" ? "#fff" : "#000",
                        backgroundColor: tempUnit === "C" ? "#000" : "transparent",
                        borderColor: "#000",
                        "&:hover": {
                          backgroundColor: tempUnit === "C" ? "#222" : "#f0f0f0",
                        },
                      }}
                    >
                      °C
                    </Button>
                    <Button
                      onClick={() => setTempUnit("F")}
                      variant={tempUnit === "F" ? "contained" : "outlined"}
                      sx={{
                        color: tempUnit === "F" ? "#fff" : "#000",
                        backgroundColor: tempUnit === "F" ? "#000" : "transparent",
                        borderColor: "#000",
                        "&:hover": {
                          backgroundColor: tempUnit === "F" ? "#222" : "#f0f0f0",
                        },
                      }}
                    >
                      °F
                    </Button>
                  </ButtonGroup>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 2,
                    pt: 15,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="h2"
                        sx={{
                          fontWeight: "bold",
                          fontSize: "4rem",
                          lineHeight: "1.2",
                        }}
                      >
                        {tempUnit === "C"
                          ? `${currentWeather.current?.temp_c}°C`
                          : `${currentWeather.current?.temp_f}°F`}
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{
                          mt: 1,
                          fontSize: "1.5rem",
                          fontWeight: "500",
                          color: "#555",
                        }}
                      >
                        {currentWeather.current?.condition?.text}
                      </Typography>
                    </Box>

                    {currentWeather.current?.condition?.icon && (
                      <img
                        src={`https:${currentWeather.current.condition.icon}`}
                        alt="weather icon"
                        width={80}
                        height={80}
                        style={{
                          marginTop: "10px",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                  </Box>

                  {forecastWeather?.forecastday?.[0]?.day && (
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "medium",
                        fontSize: "1.5rem",
                        color: "#333",
                        paddingRight: "5.5rem",
                      }}
                    >
                      {tempUnit === "C" ? (
                        <>
                          H: {forecastWeather.forecastday[0].day.maxtemp_c}°C&nbsp;&nbsp;L:{" "}
                          {forecastWeather.forecastday[0].day.mintemp_c}°C
                        </>
                      ) : (
                        <>
                          H: {forecastWeather.forecastday[0].day.maxtemp_f}°F&nbsp;&nbsp;L:{" "}
                          {forecastWeather.forecastday[0].day.mintemp_f}°F
                        </>
                      )}
                    </Typography>
                  )}

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      fontSize: "1.1rem",
                      color: "#555",
                      paddingRight: "5.5rem",
                      mt: 0.5,
                    }}
                  >
                    Feels like:{" "}
                    {tempUnit === "C"
                      ? `${currentWeather?.current?.feelslike_c ?? "—"}°C`
                      : `${currentWeather?.current?.feelslike_f ?? "—"}°F`}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      width: "100%",
                      borderRadius: "8px",
                      padding: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontStyle: "italic",
                        color: "#fff",
                        fontSize: "1.2rem",
                        fontWeight: "500",
                        letterSpacing: "0.5px",
                        zIndex: 10,
                      }}
                    >
                      {currentWeather.current?.is_day ? "Day" : "Night"}
                    </Typography>
                  </Box>
                </Box>
              </>
            ) : (
              <LoadingCard message="Loading Current Weather..." />
            )}
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: "300px", boxShadow: 1 }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6">7-Day Forecast</Typography>

              <ButtonGroup variant="outlined" size="small">
                <Button
                  onClick={() => setWindUnit("kmph")}
                  variant={windUnit === "kmph" ? "contained" : "outlined"}
                  sx={{
                    color: windUnit === "kmph" ? "#fff" : "#000",
                    backgroundColor: windUnit === "kmph" ? "#000" : "transparent",
                    borderColor: "#000",
                    "&:hover": {
                      backgroundColor: windUnit === "kmph" ? "#222" : "#f0f0f0",
                    },
                  }}
                >
                  kmph
                </Button>
                <Button
                  onClick={() => setWindUnit("mph")}
                  variant={windUnit === "mph" ? "contained" : "outlined"}
                  sx={{
                    color: windUnit === "mph" ? "#fff" : "#000",
                    backgroundColor: windUnit === "mph" ? "#000" : "transparent",
                    borderColor: "#000",
                    "&:hover": {
                      backgroundColor: windUnit === "mph" ? "#222" : "#f0f0f0",
                    },
                  }}
                >
                  mph
                </Button>
              </ButtonGroup>
            </Box>

            <Divider sx={{ my: 1 }} />

            {forecastWeather?.forecastday?.length > 0 ? (
              forecastWeather.forecastday.map((day, index) => {
                const dateObj = new Date(day.date);
                const weekday = dateObj.toLocaleDateString("en-US", { weekday: "short" });
                const date = dateObj.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
                const highLow =
                  tempUnit === "C"
                    ? `${day.day.maxtemp_c}°C / ${day.day.mintemp_c}°C`
                    : `${day.day.maxtemp_f}°F / ${day.day.mintemp_f}°F`;

                const gust =
                  windUnit === "kmph"
                    ? `${day.day.maxwind_kph} kmph`
                    : `${day.day.maxwind_mph} mph`;

                return (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      px: 1,
                      py: 1,
                      borderBottom: "1px solid #ccc",
                      fontSize: "0.9rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <Box sx={{ width: "5%" }}>{weekday}</Box>
                    <Box sx={{ width: "7%" }}>{date}</Box>
                    <Box sx={{ width: "13%" }}>{highLow}</Box>
                    <Box sx={{ width: "5%" }}>
                      <img
                        src={`https:${day.day.condition.icon}`}
                        alt={day.day.condition.text}
                        width={36}
                        height={36}
                      />
                    </Box>
                    <Box sx={{ width: "20%" }}>{day.day.condition.text}</Box>
                    <Box sx={{ width: "7%" }}>
                      <WaterDropOutlined
                        fontSize="small"
                        sx={{ verticalAlign: "middle", mr: 0.5 }}
                      />
                      {day.day.daily_chance_of_rain}%
                    </Box>
                    <Box sx={{ width: "7%" }}>
                      <AirOutlined fontSize="small" sx={{ verticalAlign: "middle", mr: 0.5 }} />
                      {gust}
                    </Box>
                  </Box>
                );
              })
            ) : (
              <LoadingCard message="Loading Forecast..." />
            )}
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", width: "98%", mb: 2 }}>
        <Card sx={{ flex: 1, minWidth: "300px", boxShadow: 1 }}>
          <CardContent>
            <WeatherAqiGauge usEpaIndex={currentWeather?.current?.air_quality?.["us-epa-index"]} />
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: "300px", boxShadow: 1 }}>
          <CardContent>
            <WeatherCompassChart windDir={currentWeather?.current?.wind_dir} />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
