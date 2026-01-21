import { useEffect, useState } from "react";

// Free, no-key reverse geocoder (BigDataCloud)
// Docs: https://www.bigdatacloud.com/docs/api/reverse-geocode-client
const REVERSE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

export default function useGeotag() {
  const [state, setState] = useState({
    ready: false,
    permission: "prompt", // "granted" | "denied" | "prompt"
    lat: null,
    lon: null,
    city: null,
    principalSubdivision: null, // state/province
    countryCode: null, // "US"
    countryName: null, // "United States"
    error: null,
  });

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setState((s) => ({ ...s, ready: true, error: "Geolocation not supported" }));
      return;
    }

    navigator.permissions
      ?.query({ name: "geolocation" })
      .then((result) => {
        setState((s) => ({ ...s, permission: result.state }));
        result.onchange = () => setState((s) => ({ ...s, permission: result.state }));
      })
      .catch(() => {});

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const lat = Number(coords.latitude.toFixed(5));
          const lon = Number(coords.longitude.toFixed(5));
          const url = `${REVERSE_URL}?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
          const res = await fetch(url);
          const data = await res.json();

          setState({
            ready: true,
            permission: "granted",
            lat,
            lon,
            city:
              data.city || data.locality || data.localityInfo?.administrative?.[0]?.name || null,
            principalSubdivision: data.principalSubdivision || null,
            countryCode: data.countryCode || null,
            countryName: data.countryName || null,
            error: null,
          });
        } catch (err) {
          setState((s) => ({ ...s, ready: true, error: "Reverse geocode failed" }));
        }
      },
      (err) => {
        setState((s) => ({
          ...s,
          ready: true,
          permission: "denied",
          error: err?.message || "User denied Geolocation",
        }));
      },
      { enableHighAccuracy: false, maximumAge: 60_000, timeout: 10_000 }
    );
  }, []);

  return state;
}
