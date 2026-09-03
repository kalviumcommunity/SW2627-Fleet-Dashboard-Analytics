"use client";

import { useEffect, useId, useRef, useState } from "react";

const rawKey =
  process.env.NEXT_PUBLIC_MAPPLS_KEY ||
  process.env.NEXT_PUBLIC_MAPMYINDIA_API_KEY ||
  "reqpzxosewtfxhrtixlizunwfgebmjwqfjbc";

const MAPPLS_KEY = rawKey.replace(/['"]+/g, "").trim();

declare global {
  interface Window {
    mappls?: any;
    L?: any;
  }
}

export interface MapMarker {
  lat: number;
  lng: number;
  popupHtml?: string;
}

interface MapProps {
  markers: MapMarker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
}

export default function Map({
  markers,
  center = { lat: 26.9124, lng: 75.7873 },
  zoom = 7,
  height = "400px",
}: MapProps) {
  const reactId = useId();
  const containerId = "map-" + reactId.replace(/[^a-zA-Z0-9]/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapSource, setMapSource] = useState<"mappls" | "osm" | "loading">("loading");

  useEffect(() => {
    let isMounted = true;
    let didFallback = false;

    const cleanupMap = () => {
      if (mapInstanceRef.current && typeof mapInstanceRef.current.remove === "function") {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn("Error removing previous map instance:", e);
        }
      }
      mapInstanceRef.current = null;
    };

    const initLeafletFallback = async () => {
      if (!containerRef.current || !isMounted || didFallback) return;
      didFallback = true;

      try {
        if (!document.getElementById("leaflet-css")) {
          const link = document.createElement("link");
          link.id = "leaflet-css";
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);
        }

        if (!window.L) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load Leaflet"));
            document.head.appendChild(script);
          });
        }

        if (!isMounted || !containerRef.current || !window.L) return;

        cleanupMap();

        const map = window.L.map(containerRef.current, { zoomControl: false }).setView(
          [center.lat, center.lng],
          zoom,
        );

        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        markers.forEach((marker) => {
          const m = window.L.marker([marker.lat, marker.lng]).addTo(map);
          if (marker.popupHtml) {
            m.bindPopup(marker.popupHtml);
          }
        });

        map.whenReady(() => {
          if (map && typeof map.invalidateSize === "function") {
            map.invalidateSize();
          }
        });

        mapInstanceRef.current = map;
        setMapSource("osm");
      } catch (err) {
        console.error("Leaflet fallback failed to load:", err);
      }
    };

    const initMappls = async () => {
      try {
        const mapplsModule = await import("mappls-web-maps");
        const mapplsClassObject = new mapplsModule.mappls();
        const loadObject = {
          map: true,
          version: "3.0",
        };

        const timeout = setTimeout(() => {
          if (isMounted && !mapInstanceRef.current && !didFallback) {
            console.warn("Mappls SDK timed out, switching to OpenStreetMap fallback...");
            initLeafletFallback();
          }
        }, 8000);

        mapplsClassObject.initialize(MAPPLS_KEY, loadObject, () => {
          clearTimeout(timeout);
          if (!isMounted || !containerRef.current || didFallback) return;

          try {
            cleanupMap();

            const newMap = mapplsClassObject.Map({
              id: containerRef.current.id,
              properties: {
                center: [center.lat, center.lng],
                zoom: zoom,
              },
            });

            const renderMarkers = () => {
              markers.forEach((marker) => {
                if (window.mappls) {
                  try {
                    new window.mappls.Marker({
                      map: newMap,
                      position: {
                        lat: marker.lat,
                        lng: marker.lng,
                      },
                      popupHtml: marker.popupHtml,
                    });
                  } catch (markerErr) {
                    console.warn("Failed to create Mappls marker:", markerErr);
                  }
                }
              });
            };

            if (newMap && typeof newMap.on === "function") {
              newMap.on("load", renderMarkers);
            } else {
              renderMarkers();
            }

            mapInstanceRef.current = newMap;
            setMapSource("mappls");
          } catch (e) {
            console.error("Error creating Mappls map instance:", e);
            initLeafletFallback();
          }
        });
      } catch (err) {
        console.warn("Mappls initialization failed, falling back to OpenStreetMap:", err);
        initLeafletFallback();
      }
    };

    initMappls();

    return () => {
      isMounted = false;
      cleanupMap();
    };
  }, [markers, center.lat, center.lng, zoom]);

  return (
    <div className="relative rounded-xl overflow-hidden border shadow-sm bg-gray-50">
      <div
        id={containerId}
        ref={containerRef}
        style={{
          width: "100%",
          height,
        }}
      />
      {mapSource === "osm" && (
        <div className="absolute top-2 right-2 z-[1000] bg-white/90 backdrop-blur-xs text-[11px] font-medium px-2 py-1 rounded shadow text-gray-600 border">
          Map: Live Fleet View (OpenStreetMap)
        </div>
      )}
    </div>
  );
}
