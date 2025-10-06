import { useLayoutEffect, useRef, useMemo } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5radar from "@amcharts/amcharts5/radar";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Box, Typography, Paper } from "@mui/material";
import LoadingCard from "../utils/LoadingCard";

const DIR_TO_DEG = {
  N: 0,
  NNE: 22.5,
  NE: 45,
  ENE: 67.5,
  E: 90,
  ESE: 112.5,
  SE: 135,
  SSE: 157.5,
  S: 180,
  SSW: 202.5,
  SW: 225,
  WSW: 247.5,
  W: 270,
  WNW: 292.5,
  NW: 315,
  NNW: 337.5,
};

export default function WeatherCompassChart({ windDir }) {
  const chartRef = useRef(null);

  const { displayDir, displayDeg } = useMemo(() => {
    const dir = windDir?.toUpperCase?.() ?? null;
    const deg = dir ? DIR_TO_DEG[dir] ?? null : null;
    return { displayDir: dir, displayDeg: deg };
  }, [windDir]);

  useLayoutEffect(() => {
    if (!chartRef.current || displayDir == null) return;

    const targetDeg = typeof displayDeg === "number" ? displayDeg : 0;

    const root = am5.Root.new(chartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5radar.RadarChart.new(root, {
        panX: false,
        panY: false,
        startAngle: -90,
        endAngle: 270,
      })
    );

    const axisRenderer = am5radar.AxisRendererCircular.new(root, {
      strokeOpacity: 1,
      strokeWidth: 5,
      minGridDistance: 10,
    });
    axisRenderer.ticks.template.setAll({ forceHidden: true });
    axisRenderer.grid.template.setAll({ forceHidden: true });
    axisRenderer.labels.template.setAll({ forceHidden: true });

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0,
        min: 0,
        max: 360,
        strictMinMax: true,
        renderer: axisRenderer,
      })
    );

    function createLabel(text, value, tickOpacity) {
      const di = xAxis.makeDataItem({ value });
      xAxis.createAxisRange(di);
      const label = di.get("label");
      label.setAll({ text, forceHidden: false, inside: true, radius: 20 });
      di.get("tick").setAll({
        forceHidden: false,
        strokeOpacity: tickOpacity,
        length: 12 * tickOpacity,
        visible: true,
        inside: true,
      });
    }
    ["N", "NE", "E", "SE", "S", "SW", "W", "NW"].forEach((d, i) => createLabel(d, i * 45, 1));
    for (let i = 0; i < 360; i += 5) createLabel("", i, 0.5);

    const backItem = xAxis.makeDataItem({ value: 0 });
    const backHand = am5radar.ClockHand.new(root, {
      pinRadius: 0,
      radius: am5.percent(90),
      bottomWidth: 40,
    });
    backHand.hand.setAll({
      fill: am5.color(0x000000),
      fillOpacity: 0.3,
    });
    backItem.set("bullet", am5xy.AxisBullet.new(root, { sprite: backHand }));
    xAxis.createAxisRange(backItem);

    const frontItem = xAxis.makeDataItem({ value: 0 });
    const frontHand = am5radar.ClockHand.new(root, {
      pinRadius: 0,
      radius: am5.percent(90),
      bottomWidth: 40,
    });
    frontHand.hand.setAll({
      fill: am5.color(0x00b7ff),
    });
    frontItem.set("bullet", am5xy.AxisBullet.new(root, { sprite: frontHand }));
    xAxis.createAxisRange(frontItem);

    const oppositeDeg = (targetDeg + 180) % 360;

    backItem.animate({
      key: "value",
      to: oppositeDeg,
      duration: 700,
      easing: am5.ease.out(am5.ease.cubic),
    });

    frontItem.animate({
      key: "value",
      to: targetDeg,
      duration: 700,
      easing: am5.ease.out(am5.ease.cubic),
    });

    chart.appear(500, 50);

    return () => root.dispose();
  }, [displayDir, displayDeg]);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Wind Direction
      </Typography>

      {displayDir == null ? (
        <LoadingCard message="Loading wind direction..." />
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
                width: 100,
                px: 1.5,
                py: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                borderRadius: 2,
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="overline" sx={{ opacity: 0.8 }}>
                Direction
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                {displayDir}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                {typeof displayDeg === "number" ? `${displayDeg}°` : "—"}
              </Typography>
            </Paper>
          </Box>
        </>
      )}
    </Box>
  );
}
