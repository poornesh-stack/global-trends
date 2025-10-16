import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Box } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

export default function CryptoChartDashboard() {
  const chartRef = useRef(null);
  const rootRef = useRef(null);
  const xAxisRef = useRef(null);
  const seriesRef = useRef(null);
  const categoriesKeyRef = useRef("");

  const [cryptodata, setCryptoData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    getCryptoCurrency();
    const interval = setInterval(() => {
      getCryptoCurrency(true);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  function getCryptoCurrency(isAutoRefresh = false) {
    if (isAutoRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    axios
      .get(`https://api.coinlore.net/api/tickers/`)
      .then((res) => {
        console.log(res.data, "Crypto Data");
        const dataArray = res?.data?.data;
        if (Array.isArray(dataArray)) {
          setCryptoData(dataArray);
        } else {
          Swal.fire("Unexpected API response format.", "", "error");
        }
      })
      .catch((err) => {
        Swal.fire("Error fetching crypto data.", "", "error");
      })
      .finally(() => {
        if (isAutoRefresh) {
          setIsRefreshing(false);
        } else {
          setIsLoading(false);
        }
      });
  }

  useLayoutEffect(() => {
    if (!chartRef.current) return;

    const root = am5.Root.new(chartRef.current);
    rootRef.current = root;
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
        paddingLeft: 0,
        paddingRight: 1,
      })
    );

    const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);

    const xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 30,
      minorGridEnabled: true,
    });

    xRenderer.labels.template.setAll({
      rotation: -90,
      centerY: am5.p50,
      centerX: am5.p100,
      paddingRight: 15,
    });

    xRenderer.grid.template.setAll({
      location: 1,
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        maxDeviation: 0.3,
        categoryField: "country",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );
    xAxisRef.current = xAxis;

    const yRenderer = am5xy.AxisRendererY.new(root, {
      strokeOpacity: 0.1,
    });

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0.3,
        renderer: yRenderer,
      })
    );

    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Series 1",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        sequencedInterpolation: true,
        categoryXField: "country",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{categoryX}: ${valueY}",
        }),
      })
    );

    seriesRef.current = series;

    xAxis.setAll({
      interpolationDuration: 700,
      interpolationEasing: am5.ease.out(am5.ease.cubic),
    });
    series.setAll({
      interpolationDuration: 700,
      interpolationEasing: am5.ease.out(am5.ease.cubic),
      sequencedInterpolation: false,
    });

    series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });

    series.columns.template.adapters.add("fill", function (fill, target) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    series.columns.template.adapters.add("stroke", function (stroke, target) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    series.appear(1000);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  useEffect(() => {
    if (!Array.isArray(cryptodata) || !xAxisRef.current || !seriesRef.current) return;

    const dataTop10 = cryptodata
      .filter((d) => d && d.price_usd != null)
      .sort((a, b) => parseFloat(b.price_usd) - parseFloat(a.price_usd))
      .slice(0, 10)
      .map((d) => ({
        country: `${d.symbol ?? d.name ?? "N/A"}`,
        value: Number.parseFloat(d.price_usd),
      }));

    const orderKey = dataTop10.map((d) => d.country).join("|");
    const orderChanged = categoriesKeyRef.current !== orderKey;

    if (orderChanged) {
      xAxisRef.current.data.setAll(dataTop10);
      seriesRef.current.data.setAll(dataTop10);
      categoriesKeyRef.current = orderKey;
    } else {
      dataTop10.forEach((d) => {
        const di = seriesRef.current.dataItems.find((it) => it.get("categoryX") === d.country);
        if (di) {
          di.animate({
            key: "valueY",
            to: d.value,
            duration: 700,
            easing: am5.ease.out(am5.ease.cubic),
          });
        }
      });
    }
  }, [cryptodata]);

  return <Box ref={chartRef} style={{ width: "100%", height: "400px", display: "flex" }}></Box>;
}
