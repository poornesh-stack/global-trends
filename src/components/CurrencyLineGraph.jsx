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
        sx={{
          mb: 2,
          backgroundColor: "transparent",
          display: "flex",
          justifyContent: "center",
          mb: 2,
          gap: 2,
          "& .MuiToggleButton-root": {
            borderRadius: "5px",
            border: "2px solid #ccc",
            padding: "6px 12px",
            color: "#333",
            fontWeight: "500",
            fontSize: "14px",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#e0e0e0",
              color: "#000",
            },
            "&.Mui-selected": {
              backgroundColor: "#d6d6d6",
              color: "#000",
              fontWeight: "bold",
              borderColor: "#bdbdbd",
            },
          },
        }}
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
