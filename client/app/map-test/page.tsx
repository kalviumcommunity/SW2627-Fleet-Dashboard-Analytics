"use client";

import Map from "@/components/Map";

export default function MapTestPage() {
  const testMarkers = [
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