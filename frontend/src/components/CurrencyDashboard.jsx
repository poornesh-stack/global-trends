import { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Box } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

export default function CurrencyDashboard({ currency1, currency2 }) {
  const chartRef = useRef(null);

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
      }),
    );

    const cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "none",
      }),
    );
    cursor.lineY.set("visible", false);

    const xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 0.2,
        baseInterval: { timeUnit: "day", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, { minorGridEnabled: true }),
        tooltip: am5.Tooltip.new(root, {}),
      }),
    );

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, { pan: "zoom" }),
      }),
    );

    const series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: "Rates",
        xAxis,
        yAxis,
        valueYField: "value",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, { labelText: "{valueY}" }),
      }),
    );

    chart.set(
      "scrollbarX",
      am5.Scrollbar.new(root, {
        orientation: "horizontal",
      }),
    );

    async function fetchOneYearWeekly(base, quote) {
      const today = new Date();
      const daysBack = 365;
      const step = 7;

      const requests = [];
      for (let i = daysBack; i >= 0; i -= step) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);

        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const dateStr = `${yyyy}-${mm}-${dd}`;

        requests.push(
          axios
            .get(
              `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${dateStr}/v1/currencies/${base}.json`,
            )
            .then((res) => {
              const rate = res.data?.[base]?.[quote];
              return rate ? { date: d.getTime(), value: rate } : null;
            })
            .catch((err) => {
              console.error(
                `Failed to fetch rate for ${dateStr}:`,
                err.message,
              );
              return null;
            }),
        );
      }

      try {
        const results = await Promise.all(requests);
        const points = results.filter(Boolean).sort((a, b) => a.date - b.date);

        if (points.length === 0) {
          console.error("No currency data available");
          Swal.fire({
            title: "No Data Available",
            text: "Unable to load historical currency data. The API may be temporarily unavailable.",
            icon: "warning",
          });
        } else {
          series.data.setAll(points);
        }
      } catch (err) {
        console.error("Error fetching currency rates:", err);
        Swal.fire({
          title: "Error",
          text: "Unable to fetch currency rates. Please try again later.",
          icon: "error",
        });
      }
    }

    fetchOneYearWeekly(currency1, currency2);

    series.appear(1000);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [currency1, currency2]);

  return (
    <Box
      sx={{
        border: "2px solid #ccc",
        padding: "25px",
        borderRadius: 2,
        width: "91%",
      }}
    >
      <Box
        ref={chartRef}
        sx={{ width: "100%", height: "400px", display: "flex" }}
      />
    </Box>
  );
}
