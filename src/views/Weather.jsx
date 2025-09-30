import { AirOutlined, SearchOutlined, WaterDropOutlined } from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Divider,
  InputBase,
  styled,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const drawerWidth = 240;
const appbarWidth = 70;

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.1),
  border: "2px solid",
  borderColor: "#000",
  padding: theme.spacing(0.5, 1),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.2),
    borderColor: "#000",
  },
  "&:focus-within": {
    borderColor: "#000",
  },
  marginLeft: 0,
  width: "20%",
  transition: "all 0.3s ease",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "30%",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0),
  height: "90%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#000",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 6),
    transition: theme.transitions.create("width"),
    border: "none",
    outline: "none",
    "&:focus": {
      width: "100%",
    },
  },
}));

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
  const [currentWeather, setCurrentWeather] = useState([]);
  const [forecastWeather, setForecastWeather] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [tempUnit, setTempUnit] = useState("C");
  const [windUnit, setWindUnit] = useState("kmph");

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

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      if (searchInput.trim() !== "") {
        getWeatherData(searchInput.trim());
      } else {
        Swal.fire("Please enter a city or zip code.", "", "warning");
      }
    }
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
              Weather Forecast
            </Typography>

            <Search>
              <SearchIconWrapper>
                <SearchOutlined />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search City or Zip Code"
                inputProps={{ "aria-label": "search" }}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </Search>
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
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                      {tempUnit === "C"
                        ? `${currentWeather.current?.temp_c}°C`
                        : `${currentWeather.current?.temp_f}°F`}
                    </Typography>

                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {currentWeather.current?.condition?.text}
                    </Typography>

                    {forecastWeather?.day && (
                      <Typography variant="body2" sx={{ mt: 1, fontWeight: "medium" }}>
                        {tempUnit === "C" ? (
                          <>
                            H: {forecastWeather.day.maxtemp_c}°C&nbsp;&nbsp;L:{" "}
                            {forecastWeather.day.mintemp_c}°C
                          </>
                        ) : (
                          <>
                            H: {forecastWeather.day.maxtemp_f}°F&nbsp;&nbsp;L:{" "}
                            {forecastWeather.day.mintemp_f}°F
                          </>
                        )}
                      </Typography>
                    )}
                  </Box>

                  {currentWeather.current?.condition?.icon && (
                    <img
                      src={`https:${currentWeather.current.condition.icon}`}
                      alt="weather icon"
                      width={50}
                      height={50}
                    />
                  )}

                  <Typography
                    variant="body2"
                    sx={{
                      ml: "auto",
                      fontStyle: "italic",
                      color: currentWeather.current?.is_day ? "orange" : "blue",
                    }}
                  >
                    {currentWeather.current?.is_day ? "Day" : "Night"}
                  </Typography>
                </Box>
              </>
            ) : (
              <Typography>Loading current weather...</Typography>
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
              <Typography>Loading forecast...</Typography>
            )}
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", width: "98%" }}>
        <Card>
          <CardContent>
            <h1>AQI</h1>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h1>Wind</h1>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
