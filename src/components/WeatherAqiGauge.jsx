import { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5radar from "@amcharts/amcharts5/radar";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Box, Typography } from "@mui/material";
import LoadingCard from "../utils/LoadingCard";

export default function WeatherAqiGauge({ usEpaIndex }) {
  const chartRef = useRef(null);

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
  }, [usEpaIndex]);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Air Quality Index
      </Typography>

      {!usEpaIndex ? (
        <LoadingCard message="Loading Air Quality Index..." />
      ) : (
        <Box ref={chartRef} style={{ width: "100%", height: "400px", display: "flex" }}></Box>
      )}
    </Box>
  );
}
