"use client";

import { useEffect, useRef, useState } from "react";

const MAPPLS_KEY =
  process.env.NEXT_PUBLIC_MAPPLS_KEY ||
  process.env.NEXT_PUBLIC_MAPMYINDIA_API_KEY ||
  "reqpzxosewtfxhrtixlizunwfgebmjwqfjbc";

declare global {
  interface Window {
    mappls?: any;
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

export default function Map({ markers, center = { lat: 26.9124, lng: 75.7873 }, zoom = 7, height = "400px" }: MapProps) {
  const mapRef = useRef<any>(null);
  const mapContainerId = useRef(`map-${Math.random().toString(36).substr(2, 9)}`);
  const [mapplsModule, setMapplsModule] = useState<any>(null);

  useEffect(() => {
    // Dynamically import to avoid Next.js SSR issues with window object
    import("mappls-web-maps").then((module) => {
      setMapplsModule(module);
    }).catch(err => {
      console.error("Failed to load mappls-web-maps module", err);
    });
  }, []);

  useEffect(() => {
    if (!mapplsModule) return;

    let isMounted = true;
    const mapplsClassObject = new mapplsModule.mappls();
    const loadObject = { 
      map: true,
      version: '3.0'
    };

    try {
      mapplsClassObject.initialize(MAPPLS_KEY, loadObject, () => {
        if (!isMounted) return;

        const newMap = mapplsClassObject.Map({
          id: mapContainerId.current,
          properties: {
            center: [center.lat, center.lng],
            zoom: zoom,
          },
        });

        newMap.on("load", () => {
          markers.forEach((marker) => {
            if (window.mappls) {
              new window.mappls.Marker({
                map: newMap,
                position: {
                  lat: marker.lat,
                  lng: marker.lng,
                },
                popupHtml: marker.popupHtml,
              });
            }
          });
        });

        mapRef.current = newMap;
      });
    } catch (error) {
      console.error("Failed to load Mappls SDK", error);
    }

    return () => {
      isMounted = false;
      if (mapRef.current && typeof mapRef.current.remove === 'function') {
        mapRef.current.remove();
      }
    };
  }, [mapplsModule, markers, center, zoom]);

  return (
    <div
      id={mapContainerId.current}
      style={{
        width: "100%",
        height,
      }}
      className="rounded-xl overflow-hidden border shadow-sm"
    />
  );
}
