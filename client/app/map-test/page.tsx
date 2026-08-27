"use client";

import { useEffect, useRef } from "react";

const MAPPLS_KEY =
  process.env.NEXT_PUBLIC_MAPPLS_KEY ||
  process.env.NEXT_PUBLIC_MAPMYINDIA_API_KEY ||
  "reqpzxosewtfxhrtixlizunwfgebmjwqfjbc";

declare global {
  interface Window {
    mappls?: any;
  }
}

export default function MapTestPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;

    scriptLoaded.current = true;

    const script = document.createElement("script");

    script.src = `https://apis.mappls.com/advancedmaps/api/${MAPPLS_KEY}/map_sdk?v=3.0&layer=vector`;
    script.async = true;

    script.onload = () => {
      if (!window.mappls || !mapRef.current) {
        console.error("Mappls SDK failed to load");
        return;
      }

      const map = new window.mappls.Map("map", {
        center: {
          lat: 28.6129,
          lng: 77.2295,
        },
        zoom: 12,
      });

      map.on("load", () => {
        new window.mappls.Marker({
          map,
          position: {
            lat: 28.6129,
            lng: 77.2295,
          },
          popupHtml: "Hardcoded POC marker",
        });
      });
    };

    script.onerror = () => {
      console.error("Failed to load Mappls SDK");
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }

      scriptLoaded.current = false;
    };
  }, []);

  return (
    <div>
      <h1 className="p-4 text-xl font-bold">Mappls SDK POC</h1>

      <div
        id="map"
        ref={mapRef}
        style={{
          width: "100%",
          height: "500px",
        }}
      />
    </div>
  );
}