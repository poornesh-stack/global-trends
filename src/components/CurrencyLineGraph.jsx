import { useLayoutEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import axios from "axios";

export default function CurrencyLineGraph({ currency1, currency2 }) {
  const chartRef = useRef(null);
  const [timeRange, setTimeRange] = useState("1M");

  useLayoutEffect(() => {
    if (!chartRef.current || !currency1 || !currency2) return;

    const root = am5.Root.new(chartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
        paddingLeft: 0,
      })
    );

    const cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "none",
      })
    );
    cursor.lineY.set("visible", false);

    const xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 0.2,
        baseInterval: { timeUnit: "day", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, { minorGridEnabled: true }),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          pan: "zoom",
        }),
      })
    );

    const series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: "Rates",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{valueY}",
        }),
      })
    );

    chart.set(
      "scrollbarX",
      am5.Scrollbar.new(root, {
        orientation: "horizontal",
      })
    );

    function getDaysForRange(range) {
      switch (range) {
        case "1D":
          return 1;
        case "5D":
          return 5;
        case "1M":
          return 30;
        case "1Y":
          return 365;
        default:
          return 30;
      }
    }

    function historicalData(currency1, currency2, range) {
      const today = new Date();
      const request = [];
      const days = getDaysForRange(range);

      const step = days > 365 ? 30 : days > 90 ? 7 : 1;

      for (let i = days; i >= 0; i -= step) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);

        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const dateStr = `${yyyy}-${mm}-${dd}`;

        request.push(
          axios
            .get(
              `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${dateStr}/v1/currencies/${currency1}.json`
            )
            .then((res) => {
              const rate = res.data[currency1]?.[currency2];
              if (rate) {
                return { date: d.getTime(), value: rate };
              }
              return null;
            })
        );
      }

      Promise.all(request)
        .then((results) => {
          const dataPoints = results.filter((item) => item !== null);
          series.data.setAll(dataPoints);
        })
        .catch((err) => {
          Swal.fire("Error fetching Currency Rates.", "", "error");
        });
    }

    historicalData(currency1, currency2, timeRange);

    series.appear(1000);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [currency1, currency2, timeRange]);

  return (
    <Box
      sx={{
        border: "2px solid #ccc",
        padding: "25px",
        borderRadius: 2,
        width: "50vw",
      }}
    >
      <ToggleButtonGroup
        value={timeRange}
        exclusive
        onChange={(e, newRange) => {
          if (newRange) setTimeRange(newRange);
        }}
        size="small"
        sx={(theme) => ({
          display: "flex",
          justifyContent: "center",
          gap: 1,
          mb: 2,
          p: 0.5,
          borderRadius: 999,
          backdropFilter: "blur(8px)",
          backgroundColor:
            theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 6px 18px rgba(0,0,0,0.3)"
              : "0 6px 18px rgba(0,0,0,0.08)",
          "& .MuiToggleButton-root": {
            textTransform: "none",
            minWidth: 56,
            px: 1.5,
            py: 0.75,
            borderRadius: 999,
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: "transparent",
            color: theme.palette.text.primary,
            fontWeight: 600,
            fontSize: { xs: 12, sm: 13, md: 14 },
            letterSpacing: 0.2,
            transition: "transform 180ms ease, box-shadow 180ms ease, background 200ms",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 8px 20px rgba(0,0,0,0.35)"
                  : "0 8px 20px rgba(0,0,0,0.10)",
              backgroundColor:
                theme.palette.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
            },
            "&.Mui-selected": {
              color: theme.palette.getContrastText(theme.palette.primary.main),
              borderColor: "transparent",
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 10px 22px rgba(0,0,0,0.45)"
                  : "0 10px 22px rgba(0,0,0,0.12)",
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              "&:hover": {
                transform: "translateY(-2px)",
                filter: "brightness(1.02)",
              },
            },
            "&.Mui-focusVisible": {
              outline: "none",
              boxShadow: `0 0 0 3px ${theme.palette.primary.main}40`,
            },
          },
          "& .MuiToggleButtonGroup-grouped": {
            border: "none",
            "&:not(:first-of-type)": { border: "none" },
            "&:first-of-type": { border: "none" },
          },
        })}
      >
        <ToggleButton value="1D">1D</ToggleButton>
        <ToggleButton value="5D">5D</ToggleButton>
        <ToggleButton value="1M">1M</ToggleButton>
        <ToggleButton value="1Y">1Y</ToggleButton>
      </ToggleButtonGroup>

      <Box ref={chartRef} sx={{ width: "100%", height: "400px", display: "flex" }}></Box>
    </Box>
  );
}
