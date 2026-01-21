import { useLayoutEffect, useRef, useMemo } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5radar from "@amcharts/amcharts5/radar";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Box, Paper, Typography, Chip } from "@mui/material";
import LoadingCard from "../utils/LoadingCard";

export default function WeatherAqiGauge({ usEpaIndex }) {
  const chartRef = useRef(null);

  const aqiInfo = useMemo(() => {
    const idx = Number(usEpaIndex) || 0;
    const map = {
      1: {
        title: "Good",
        color: "#00e400",
        message: "Air quality is satisfactory, and air pollution poses little or no risk.",
      },
      2: {
        title: "Moderate",
        color: "#f3eb0c",
        message:
          "Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.",
      },
      3: {
        title: "Unhealthy for Sensitive Groups",
        color: "#ff7e00",
        message:
          "Members of sensitive groups may experience health effects. The general public is less likely to be affected.",
      },
      4: {
        title: "Unhealthy",
        color: "#ff0000",
        message:
          "Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.",
      },
      5: {
        title: "Very Unhealthy",
        color: "#8f3f97",
        message: "Health alert: The risk of health effects is increased for everyone.",
      },
      6: {
        title: "Hazardous",
        color: "#7e0023",
        message: "Health warning of emergency conditions: everyone is more likely to be affected.",
      },
    };
    return (
      map[idx] ?? {
        title: "Unknown",
        color: "#9e9e9e",
        message: "Air quality data is unavailable.",
      }
    );
  }, [usEpaIndex]);

  useLayoutEffect(() => {
    if (!chartRef.current) return;

    const root = am5.Root.new(chartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5radar.RadarChart.new(root, {
        panX: false,
        panY: false,
        startAngle: 160,
        endAngle: 380,
      })
    );

    const axisRenderer = am5radar.AxisRendererCircular.new(root, {
      innerRadius: -40,
    });

    axisRenderer.grid.template.setAll({
      stroke: root.interfaceColors.get("background"),
      visible: true,
      strokeOpacity: 0.8,
    });

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0,
        min: 1,
        max: 7,
        strictMinMax: true,
        renderer: axisRenderer,
      })
    );

    const axisDataItem = xAxis.makeDataItem({});

    const clockHand = am5radar.ClockHand.new(root, {
      pinRadius: am5.percent(20),
      radius: am5.percent(100),
      bottomWidth: 40,
    });

    clockHand.pin.set("fill", am5.color(0x000000));
    clockHand.hand.set("fill", am5.color(0x000000));

    axisDataItem.set(
      "bullet",
      am5xy.AxisBullet.new(root, {
        sprite: clockHand,
      })
    );

    xAxis.createAxisRange(axisDataItem);

    const label = chart.radarContainer.children.push(
      am5.Label.new(root, {
        fill: am5.color(0xffffff),
        centerX: am5.percent(50),
        textAlign: "center",
        centerY: am5.percent(50),
        fontSize: "1.5em",
        fontWeight: "bold",
      })
    );

    if (usEpaIndex) {
      axisDataItem.set("value", usEpaIndex);
      axisDataItem.animate({
        key: "value",
        to: usEpaIndex,
        duration: 1000,
        easing: am5.ease.out(am5.ease.cubic),
      });
    }

    clockHand.on("rotation", function () {
      let value = axisDataItem.get("value");
      let fill = am5.color(0x000000);

      xAxis.axisRanges.each(function (axisRange) {
        if (value >= axisRange.get("value") && value <= axisRange.get("endValue")) {
          fill = axisRange.get("axisFill").get("fill");
        }
      });

      label.set("text", `AQI: ${usEpaIndex}`);

      clockHand.pin.set("fill", fill);
      clockHand.hand.set("fill", fill);

      clockHand.pin.set("fill", am5.color(0x000000));
      clockHand.hand.set("fill", am5.color(0x000000));
    });

    chart.bulletsContainer.set("mask", undefined);

    const bandsData = [
      { title: "Good", color: "#00e400", lowScore: 1, highScore: 2 },
      { title: "Moderate", color: "#f3eb0c", lowScore: 2.01, highScore: 3 },
      { title: "Sensitive", color: "#ff7e00", lowScore: 3.01, highScore: 4 },
      { title: "Unhealthy", color: "#ff0000", lowScore: 4.01, highScore: 5 },
      { title: "Very Unhealthy", color: "#8f3f97", lowScore: 5.01, highScore: 6 },
      { title: "Hazardous", color: "#7e0023", lowScore: 6.01, highScore: 7 },
    ];

    am5.array.each(bandsData, function (data) {
      let axisRange = xAxis.createAxisRange(xAxis.makeDataItem({}));

      axisRange.setAll({
        value: data.lowScore,
        endValue: data.highScore,
      });

      axisRange.get("axisFill").setAll({
        visible: true,
        fill: am5.color(data.color),
        fillOpacity: 0.8,
      });

      axisRange.get("label").setAll({
        text: data.title,
        inside: true,
        radius: 15,
        fontSize: "1.0em",
        fill: root.interfaceColors.get("background"),
      });
    });

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [usEpaIndex, aqiInfo.title]);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Air Quality Index
      </Typography>

      {!usEpaIndex ? (
        <LoadingCard message="Loading Air Quality Index..." />
      ) : (
        <>
          <Box
            ref={chartRef}
            sx={{ width: "100%", height: 400, display: "flex", flex: 1, minWidth: 260 }}
          />

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Paper
              elevation={1}
              sx={{
                minWidth: 280,
                px: 1.75,
                py: 1.25,
                display: "grid",
                gap: 0.25,
                borderRadius: 2,
                border: (t) => `1px solid ${t.palette.divider}`,
              }}
            >
              <Typography variant="overline" sx={{ opacity: 0.8 }}>
                Air Quality
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Chip
                  size="small"
                  label={aqiInfo.title}
                  sx={{
                    fontWeight: 700,
                    color: "#001133",
                    bgcolor: aqiInfo.color,
                  }}
                />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  AQI Index: <b>{usEpaIndex}</b>
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {aqiInfo.message}
              </Typography>
            </Paper>
          </Box>
        </>
      )}
    </Box>
  );
}
