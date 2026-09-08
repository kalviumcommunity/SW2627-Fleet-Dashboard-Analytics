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

const RED_POINTER_SVG_HTML = `
  <div style="width:32px;height:45px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 45" width="32" height="45" fill="none">
      <defs>
        <filter id="shadowRedLeaflet" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.35"/>
        </filter>
        <linearGradient id="redGradLeaflet" x1="16" y1="2" x2="16" y2="43" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#EF4444"/>
          <stop offset="60%" stop-color="#DC2626"/>
          <stop offset="100%" stop-color="#991B1B"/>
        </linearGradient>
      </defs>
      <path
        d="M16 2C8.82 2 3 7.82 3 15C3 24.8 16 43 16 43C16 43 29 24.8 29 15C29 7.82 23.18 2 16 2Z"
        fill="url(#redGradLeaflet)"
        stroke="#7F1D1D"
        stroke-width="1"
        filter="url(#shadowRedLeaflet)"
      />
      <circle cx="16" cy="15" r="8.5" fill="#FFFFFF"/>
      <g transform="translate(9.5, 9.5) scale(0.54)">
        <path d="M4 11.5L6.5 5.5C6.8 4.6 7.6 4 8.6 4H15.4C16.4 4 17.2 4.6 17.5 5.5L20 11.5V18C20 18.6 19.6 19 19 19H18C17.4 19 17 18.6 17 18V17H7V18C7 18.6 6.6 19 6 19H5C4.4 19 4 18.6 4 18V11.5Z" fill="#374151"/>
        <path d="M6.8 10L8.2 6.2C8.3 5.8 8.7 5.5 9.1 5.5H14.9C15.3 5.5 15.7 5.8 15.8 6.2L17.2 10H6.8Z" fill="#FFFFFF"/>
        <circle cx="7" cy="13.5" r="1.5" fill="#FFFFFF"/>
        <circle cx="17" cy="13.5" r="1.5" fill="#FFFFFF"/>
        <rect x="9.5" y="13" width="5" height="1.5" rx="0.75" fill="#FFFFFF"/>
      </g>
    </svg>
  </div>
`;

const RED_POINTER_DATA_URL =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 45" width="32" height="45" fill="none">
  <defs>
    <filter id="shadowRed" x="-20%" y="-10%" width="140%" height="130%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
    <linearGradient id="redGrad" x1="16" y1="2" x2="16" y2="43" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#EF4444"/>
      <stop offset="60%" stop-color="#DC2626"/>
      <stop offset="100%" stop-color="#991B1B"/>
    </linearGradient>
  </defs>
  <path
    d="M16 2C8.82 2 3 7.82 3 15C3 24.8 16 43 16 43C16 43 29 24.8 29 15C29 7.82 23.18 2 16 2Z"
    fill="url(#redGrad)"
    stroke="#7F1D1D"
    stroke-width="1"
    filter="url(#shadowRed)"
  />
  <circle cx="16" cy="15" r="8.5" fill="#FFFFFF"/>
  <g transform="translate(9.5, 9.5) scale(0.54)">
    <path d="M4 11.5L6.5 5.5C6.8 4.6 7.6 4 8.6 4H15.4C16.4 4 17.2 4.6 17.5 5.5L20 11.5V18C20 18.6 19.6 19 19 19H18C17.4 19 17 18.6 17 18V17H7V18C7 18.6 6.6 19 6 19H5C4.4 19 4 18.6 4 18V11.5Z" fill="#374151"/>
    <path d="M6.8 10L8.2 6.2C8.3 5.8 8.7 5.5 9.1 5.5H14.9C15.3 5.5 15.7 5.8 15.8 6.2L17.2 10H6.8Z" fill="#FFFFFF"/>
    <circle cx="7" cy="13.5" r="1.5" fill="#FFFFFF"/>
    <circle cx="17" cy="13.5" r="1.5" fill="#FFFFFF"/>
    <rect x="9.5" y="13" width="5" height="1.5" rx="0.75" fill="#FFFFFF"/>
  </g>
</svg>
`.trim());

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
  const nativeMarkersRef = useRef<any[]>([]);
  const [mapSource, setMapSource] = useState<"mappls" | "osm" | "loading">("loading");

  useEffect(() => {
    let isMounted = true;
    let didFallback = false;

    const injectCustomMarkerStyleOnce = () => {
      if (typeof document !== "undefined" && !document.getElementById("red-pointer-marker-style")) {
        const style = document.createElement("style");
        style.id = "red-pointer-marker-style";
        style.innerHTML = `
          .red-pointer-marker {
            background: transparent !important;
            border: none !important;
          }
          .red-pointer-marker svg, .red-pointer-marker img {
            display: block;
            transition: transform 0.15s ease-in-out;
          }
          .red-pointer-marker:hover svg, .red-pointer-marker:hover img {
            transform: scale(1.15) translateY(-2px);
          }
        `;
        document.head.appendChild(style);
      }
    };

    const clearNativeMarkers = () => {
      nativeMarkersRef.current.forEach((m) => {
        try {
          if (typeof m.remove === "function") m.remove();
          else if (typeof m.setMap === "function") m.setMap(null);
        } catch {
          // ignore cleanup errors
        }
      });
      nativeMarkersRef.current = [];
    };

    const cleanupMap = () => {
      clearNativeMarkers();
      if (mapInstanceRef.current) {
        try {
          if (typeof mapInstanceRef.current.removeLayer === "function" && mapInstanceRef.current.getLayer?.("vehicles-layer")) {
            mapInstanceRef.current.removeLayer("vehicles-layer");
          }
          if (typeof mapInstanceRef.current.removeSource === "function" && mapInstanceRef.current.getSource?.("vehicles-source")) {
            mapInstanceRef.current.removeSource("vehicles-source");
          }
          if (typeof mapInstanceRef.current.remove === "function") {
            mapInstanceRef.current.remove();
          }
        } catch (e) {
          console.warn("Error cleaning up map instance:", e);
        }
      }
      mapInstanceRef.current = null;
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };

    // ---------------- Leaflet / OpenStreetMap fallback ----------------
    const loadScriptOnce = (src: string) =>
      new Promise<void>((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
      });

    const loadCssOnce = (id: string, href: string) => {
      if (!document.getElementById(id)) {
        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
      }
    };

    const initLeafletFallback = async () => {
      if (!containerRef.current || !isMounted || didFallback) return;
      didFallback = true;

      try {
        loadCssOnce("leaflet-css", "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css");
        injectCustomMarkerStyleOnce();

        if (!window.L) {
          await loadScriptOnce("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js");
        }

        if (!isMounted || !containerRef.current || !window.L) return;

        cleanupMap();

        const map = window.L.map(containerRef.current, { zoomControl: true }).setView(
          [center.lat, center.lng],
          zoom,
        );

        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        if (markers.length > 300) {
          // Canvas renderer allows rendering thousands of points effortlessly without DOM lag
          const canvasRenderer = window.L.canvas({ padding: 0.5 });
          markers.forEach((marker) => {
            const circle = window.L.circleMarker([marker.lat, marker.lng], {
              renderer: canvasRenderer,
              radius: 5,
              fillColor: "#EF4444",
              color: "#991B1B",
              weight: 1.5,
              fillOpacity: 0.9,
            }).addTo(map);

            if (marker.popupHtml) {
              circle.bindPopup(marker.popupHtml);
            }
            nativeMarkersRef.current.push(circle);
          });
        } else {
          // Standard DOM red pins for smaller marker sets
          const redDivIcon = window.L.divIcon({
            className: "red-pointer-marker",
            html: RED_POINTER_SVG_HTML,
            iconSize: [32, 45],
            iconAnchor: [16, 44],
            popupAnchor: [0, -42],
          });

          markers.forEach((marker) => {
            const m = window.L.marker([marker.lat, marker.lng], { icon: redDivIcon }).addTo(map);
            if (marker.popupHtml) {
              m.bindPopup(marker.popupHtml);
            }
            nativeMarkersRef.current.push(m);
          });
        }

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

    // ---------------- Mappls: Separate Red Pointers (High-Performance WebGL + Native) ----------------
    const renderMapplsMarkers = (map: any) => {
      if (!containerRef.current || !map) return;

      clearNativeMarkers();

      // Clean up previous GeoJSON layer & source if any
      try {
        if (typeof map.getLayer === "function" && map.getLayer("vehicles-layer")) {
          map.removeLayer("vehicles-layer");
        }
        if (typeof map.getSource === "function" && map.getSource("vehicles-source")) {
          map.removeSource("vehicles-source");
        }
      } catch (e) {
        // ignore cleanup error
      }

      if (markers.length === 0) return;

      // When rendering massive marker datasets (e.g. 10,000 vehicles), MapLibre/Mapbox GL's
      // WebGL GeoJSON symbol layer renders all 10,000 red pointers on the GPU at a fluid 60fps!
      if (markers.length > 200 && typeof map.addSource === "function" && typeof map.addLayer === "function") {
        const geojsonData = {
          type: "FeatureCollection",
          features: markers.map((m, index) => ({
            type: "Feature",
            id: index,
            geometry: {
              type: "Point",
              coordinates: [m.lng, m.lat],
            },
            properties: {
              popupHtml: m.popupHtml || "",
              id: index,
            },
          })),
        };

        const setupLayer = () => {
          try {
            if (typeof map.isStyleLoaded === "function" && !map.isStyleLoaded()) {
              map.once("styledata", setupLayer);
              return;
            }

            if (map.getSource("vehicles-source")) {
              map.getSource("vehicles-source").setData(geojsonData);
              return;
            }

            map.addSource("vehicles-source", {
              type: "geojson",
              data: geojsonData,
            });

            const addSymbolLayer = () => {
              if (map.getLayer("vehicles-layer")) return;
              map.addLayer({
                id: "vehicles-layer",
                type: "symbol",
                source: "vehicles-source",
                layout: {
                  "icon-image": "red-pointer",
                  "icon-size": 0.18,
                  "icon-anchor": "bottom",
                  "icon-allow-overlap": true,
                  "icon-ignore-placement": true,
                },
              });

              map.on("click", "vehicles-layer", (e: any) => {
                if (!e.features || e.features.length === 0) return;
                const feature = e.features[0];
                const coords = feature.geometry.coordinates.slice();
                const popupHtml = feature.properties?.popupHtml;

                if (popupHtml && window.mappls && typeof window.mappls.InfoWindow === "function") {
                  try {
                    new window.mappls.InfoWindow({
                      map,
                      position: { lat: coords[1], lng: coords[0] },
                      content: popupHtml,
                    });
                  } catch (err) {
                    console.error("Error opening InfoWindow:", err);
                  }
                }
              });

              map.on("mouseenter", "vehicles-layer", () => {
                if (map.getCanvas) map.getCanvas().style.cursor = "pointer";
              });
              map.on("mouseleave", "vehicles-layer", () => {
                if (map.getCanvas) map.getCanvas().style.cursor = "";
              });
            };

            if (typeof map.hasImage === "function" && map.hasImage("red-pointer")) {
              addSymbolLayer();
            } else {
              const img = new Image(174, 247);
              img.src = "/red-pointer.png";
              img.onload = () => {
                try {
                  if (typeof map.hasImage === "function" && !map.hasImage("red-pointer")) {
                    map.addImage("red-pointer", img);
                  }
                  addSymbolLayer();
                } catch (e) {
                  console.error("Error adding red-pointer image:", e);
                }
              };
              img.onerror = () => {
                const svgImg = new Image(32, 45);
                svgImg.src = "/red-pointer.svg";
                svgImg.onload = () => {
                  try {
                    if (typeof map.hasImage === "function" && !map.hasImage("red-pointer")) {
                      map.addImage("red-pointer", svgImg);
                    }
                    addSymbolLayer();
                  } catch (e) {
                    console.error("Error adding red-pointer svg fallback:", e);
                  }
                };
              };
            }
          } catch (err) {
            console.error("Error creating WebGL vehicles layer:", err);
          }
        };

        if (typeof map.loaded === "function" && map.loaded()) {
          setupLayer();
        } else if (typeof map.on === "function") {
          map.once("load", setupLayer);
        } else {
          setupLayer();
        }
        return;
      }

      // Standard markers for <= 200 items
      const iconUrl =
        typeof window !== "undefined" && window.location.origin
          ? `${window.location.origin}/red-pointer.png`
          : RED_POINTER_DATA_URL;

      markers.forEach((marker) => {
        try {
          const nativeMarker = new window.mappls.Marker({
            map,
            position: { lat: marker.lat, lng: marker.lng },
            icon: iconUrl,
            width: 32,
            height: 45,
            popupHtml: marker.popupHtml,
          });
          nativeMarkersRef.current.push(nativeMarker);
        } catch (e) {
          console.error("Error creating individual Mappls red pointer marker:", e);
        }
      });
    };

    const attachMapplsEvents = (newMap: any) => {
      const render = () => renderMapplsMarkers(newMap);

      if (newMap && typeof newMap.on === "function") {
        newMap.on("load", render);
        if (typeof newMap.loaded === "function" && newMap.loaded()) {
          render();
        }
      } else {
        render();
      }
    };

    const tryInitMapplsWithKey = async (key: string): Promise<boolean> => {
      return new Promise((resolve) => {
        let finished = false;
        const done = (success: boolean) => {
          if (!finished) {
            finished = true;
            resolve(success);
          }
        };

        const timeout = setTimeout(() => {
          done(false);
        }, 6000);

        import("mappls-web-maps")
          .then((mapplsModule) => {
            const mapplsClassObject = new mapplsModule.mappls();
            const loadObject = {
              map: true,
              version: "3.0",
            };

            mapplsClassObject.initialize(key, loadObject, () => {
              clearTimeout(timeout);
              if (!isMounted || !containerRef.current) {
                done(false);
                return;
              }

              try {
                cleanupMap();

                const newMap = mapplsClassObject.Map({
                  id: containerRef.current.id,
                  properties: {
                    center: [center.lat, center.lng],
                    zoom: zoom,
                  },
                });

                attachMapplsEvents(newMap);

                mapInstanceRef.current = newMap;
                setMapSource("mappls");
                done(true);
              } catch (e) {
                console.error("Error creating Mappls map instance with key:", e);
                done(false);
              }
            });
          })
          .catch((err) => {
            clearTimeout(timeout);
            console.warn("Failed to load mappls-web-maps:", err);
            done(false);
          });
      });
    };

    const initMappls = async () => {
      if (window.mappls && containerRef.current) {
        try {
          cleanupMap();
          const mapplsModule = await import("mappls-web-maps");
          const mapplsClassObject = new mapplsModule.mappls();
          const newMap = mapplsClassObject.Map({
            id: containerRef.current.id,
            properties: {
              center: [center.lat, center.lng],
              zoom: zoom,
            },
          });

          attachMapplsEvents(newMap);

          mapInstanceRef.current = newMap;
          setMapSource("mappls");
          return;
        } catch (e) {
          console.warn("Quick init with existing window.mappls failed:", e);
        }
      }

      const keysToTry: string[] = [];
      if (MAPPLS_KEY) keysToTry.push(MAPPLS_KEY);
      const fallbackKey = "reqpzxosewtfxhrtixlizunwfgebmjwqfjbc";
      if (!keysToTry.includes(fallbackKey)) keysToTry.push(fallbackKey);

      for (const key of keysToTry) {
        if (!isMounted) return;
        const success = await tryInitMapplsWithKey(key);
        if (success) return;
      }

      if (isMounted && !didFallback) {
        console.warn("Mappls SDK failed or timed out, switching cleanly to OpenStreetMap...");
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