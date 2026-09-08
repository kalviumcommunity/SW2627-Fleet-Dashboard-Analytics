"use client";

import { useState, useMemo } from "react";
import Map from "@/components/Map";

export default function MapTestPage() {
  const [markerCount, setMarkerCount] = useState<number>(10000);

  const testMarkers = useMemo(() => {
    if (markerCount === 4) {
      return [
        {
          lat: 28.6129,
          lng: 77.2295,
          popupHtml: "<b>Vehicle 1</b><br/>New Delhi Central",
        },
        {
          lat: 28.62,
          lng: 77.21,
          popupHtml: "<b>Vehicle 2</b><br/>Connaught Place",
        },
        {
          lat: 28.605,
          lng: 77.24,
          popupHtml: "<b>Vehicle 3</b><br/>India Gate East",
        },
        {
          lat: 28.635,
          lng: 77.22,
          popupHtml: "<b>Vehicle 4</b><br/>Pahar Ganj",
        },
      ];
    }

    // 10,000 red pointer markers around Delhi / NCR
    return Array.from({ length: 10000 }, (_, i) => ({
      lat: 28.6129 + Math.sin(i * 0.13) * 0.35 + ((i % 50) - 25) * 0.008,
      lng: 77.2295 + Math.cos(i * 0.17) * 0.35 + (Math.floor(i / 50) - 100) * 0.004,
      popupHtml: `<b>Vehicle #${i + 1}</b><br/>Coords: ${28.6129.toFixed(3)}, ${77.2295.toFixed(3)}`,
    }));
  }, [markerCount]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold">Map SDK Test & POC</h1>
          <p className="text-xs text-gray-500 mt-1">
            Plotted {testMarkers.length.toLocaleString()} individual red pointers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMarkerCount(4)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition ${
              markerCount === 4
                ? "bg-blue-600 text-white"
                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            4 Markers
          </button>
          <button
            onClick={() => setMarkerCount(10000)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition ${
              markerCount === 10000
                ? "bg-blue-600 text-white shadow-xs"
                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            10,000 Markers (GPU WebGL)
          </button>
        </div>
      </div>

      <Map
        markers={testMarkers}
        center={{ lat: 28.6129, lng: 77.2295 }}
        zoom={11}
        height="550px"
      />
    </div>
  );
}