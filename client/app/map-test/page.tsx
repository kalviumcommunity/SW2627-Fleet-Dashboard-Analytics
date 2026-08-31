"use client";

import Map from "@/components/Map";

export default function MapTestPage() {
  const testMarkers = [
    {
      lat: 28.6129,
      lng: 77.2295,
      popupHtml: "<b>Hardcoded POC marker</b><br/>New Delhi",
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Map SDK Test & POC</h1>
      <Map
        markers={testMarkers}
        center={{ lat: 28.6129, lng: 77.2295 }}
        zoom={12}
        height="500px"
      />
    </div>
  );
}