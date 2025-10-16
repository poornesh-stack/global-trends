import { AirOutlined, WaterDropOutlined } from "@mui/icons-material";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import LoadingCard from "../utils/LoadingCard";

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

export default function WeatherDashboard() {
  const [currentWeather, setCurrentWeather] = useState([]);
  const [forecastWeather, setForecastWeather] = useState(null);
  const [tempUnit, setTempUnit] = useState("C");
  const [windUnit, setWindUnit] = useState("kmph");

  useEffect(() => {
    getWeatherData("bangalore");
  }, []);

  function getWeatherData(query = "bangalore") {
    axios
      .get(
        `http://api.weatherapi.com/v1/forecast.json?key=2960e70f84bc49e9a5c10515251410&q=${query}&days=7&aqi=yes&alerts=yes`
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

  return (
    <Stack direction="row" gap={2}>
      <Card sx={{ flex: 1, minWidth: "300px", boxShadow: 1 }}>
        <CardContent>
          {currentWeather?.location ? (
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
          ) : (
            <LoadingCard message="Loading Current Weather..." />
          )}
        </CardContent>
      </Card>

      <Card sx={{ flex: 1, minWidth: "300px", boxShadow: 1 }}>
        <CardContent>
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
                windUnit === "kmph" ? `${day.day.maxwind_kph} kmph` : `${day.day.maxwind_mph} mph`;

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
                    <WaterDropOutlined fontSize="small" sx={{ verticalAlign: "middle", mr: 0.5 }} />
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
    </Stack>
  );
}
