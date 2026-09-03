"use client";

import { useEffect, useId, useRef, useState } from "react";

const MAPPLS_KEY =
  process.env.NEXT_PUBLIC_MAPPLS_KEY ||
  process.env.NEXT_PUBLIC_MAPMYINDIA_API_KEY ||
  "reqpzxosewtfxhrtixlizunwfgebmjwqfjbc";

// Pixel radius within which nearby markers get grouped into one cluster.
// Tune this if clusters feel too eager / too sparse.
const CLUSTER_RADIUS_PX = 60;

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

interface ClusterBubble {
  x: number;
  y: number;
  count: number;
  lat: number; // centroid, used for zoom-in on click
  lng: number;
}

interface PixelPoint {
  x: number;
  y: number;
  marker: MapMarker;
}

// Simple greedy pixel-distance clustering. O(n^2) — fine for hundreds/low
// thousands of markers. Swap for a library like supercluster if the fleet
// grows much larger and this starts to feel slow.
function clusterPixelPoints(points: PixelPoint[], radiusPx: number) {
  const used = new Array(points.length).fill(false);
  const clusters: { x: number; y: number; markers: MapMarker[] }[] = [];

  for (let i = 0; i < points.length; i++) {
    if (used[i]) continue;
    const group = [points[i]];
    used[i] = true;

    for (let j = i + 1; j < points.length; j++) {
      if (used[j]) continue;
      const dx = points[i].x - points[j].x;
      const dy = points[i].y - points[j].y;
      if (Math.sqrt(dx * dx + dy * dy) <= radiusPx) {
        group.push(points[j]);
        used[j] = true;
      }
    }

    const avgX = group.reduce((s, p) => s + p.x, 0) / group.length;
    const avgY = group.reduce((s, p) => s + p.y, 0) / group.length;

    clusters.push({
      x: avgX,
      y: avgY,
      markers: group.map((g) => g.marker),
    });
  }

  return clusters;
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
  const nativeMarkersRef = useRef<any[]>([]);
  const [mapSource, setMapSource] = useState<"mappls" | "osm" | "loading">("loading");
  const [clusterBubbles, setClusterBubbles] = useState<ClusterBubble[]>([]);

  useEffect(() => {
    let isMounted = true;
    let didFallback = false;

    const clearNativeMarkers = () => {
      nativeMarkersRef.current.forEach((m) => {
        try {
          if (typeof m.remove === "function") m.remove();
          else if (typeof m.setMap === "function") m.setMap(null);
        } catch {
          // ignore cleanup errors from either SDK
        }
      });
      nativeMarkersRef.current = [];
    };

    const cleanupMap = () => {
      clearNativeMarkers();
      if (mapInstanceRef.current && typeof mapInstanceRef.current.remove === "function") {
        mapInstanceRef.current.remove();
      }
      mapInstanceRef.current = null;
      setClusterBubbles([]);
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
        loadCssOnce(
          "leaflet-cluster-css",
          "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css"
        );
        loadCssOnce(
          "leaflet-cluster-default-css",
          "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css"
        );

        if (!window.L) {
          await loadScriptOnce("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js");
        }
        if (!window.L.MarkerClusterGroup) {
          await loadScriptOnce(
            "https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"
          );
        }

        if (!isMounted || !containerRef.current || !window.L) return;

        cleanupMap();

        const map = window.L.map(containerRef.current, { zoomControl: false }).setView(
          [center.lat, center.lng],
          zoom,
        );

        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        // leaflet.markercluster handles grouping, spiderfying, and zoom-to-expand
        // natively, so we don't need our custom pixel clustering here.
        const clusterGroup = window.L.markerClusterGroup({
          maxClusterRadius: CLUSTER_RADIUS_PX,
        });

        markers.forEach((marker) => {
          const m = window.L.marker([marker.lat, marker.lng]);
          if (marker.popupHtml) {
            m.bindPopup(marker.popupHtml);
          }
          clusterGroup.addLayer(m);
        });

        map.addLayer(clusterGroup);

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

    // ---------------- Mappls ----------------
    const renderMapplsClusters = (map: any, mapplsClassObject: any) => {
      if (!containerRef.current || !map || !window.mappls) return;

      const points: PixelPoint[] = markers
        .map((marker) => {
          try {
            const projected = map.project([marker.lng, marker.lat]);
            if (!projected) return null;
            return { x: projected.x, y: projected.y, marker };
          } catch {
            return null;
          }
        })
        .filter((p): p is PixelPoint => p !== null);

      const clusters = clusterPixelPoints(points, CLUSTER_RADIUS_PX);

      clearNativeMarkers();
      const bubbles: ClusterBubble[] = [];

      clusters.forEach((cluster) => {
        if (cluster.markers.length === 1) {
          const marker = cluster.markers[0];
          try {
            const nativeMarker = new window.mappls!.Marker({
              map,
              position: { lat: marker.lat, lng: marker.lng },
              popupHtml: marker.popupHtml,
            });
            nativeMarkersRef.current.push(nativeMarker);
          } catch (e) {
            console.error("Error creating individual Mappls marker:", e);
          }
        } else {
          // Multi-marker cluster: draw as an HTML bubble overlay instead of
          // a native marker, positioned using the map's own projection so
          // it stays aligned on pan/zoom.
          const avgLat =
            cluster.markers.reduce((s, m) => s + m.lat, 0) / cluster.markers.length;
          const avgLng =
            cluster.markers.reduce((s, m) => s + m.lng, 0) / cluster.markers.length;

          bubbles.push({
            x: cluster.x,
            y: cluster.y,
            count: cluster.markers.length,
            lat: avgLat,
            lng: avgLng,
          });
        }
      });

      setClusterBubbles(bubbles);
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
            console.warn("Mappls SDK timed out, switching to OpenStreetMap...");
            initLeafletFallback();
          }
        }, 1200);

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

            const recompute = () => renderMapplsClusters(newMap, mapplsClassObject);

            newMap.on("load", recompute);
            // Recompute clusters whenever the view settles, so bubbles
            // regroup/split as the user pans or zooms.
            newMap.on("moveend", recompute);
            newMap.on("zoomend", recompute);

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

  const handleBubbleClick = (bubble: ClusterBubble) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    try {
      if (typeof map.flyTo === "function") {
        // Mappls (MapLibre-style) API
        map.flyTo({ center: [bubble.lng, bubble.lat], zoom: (map.getZoom?.() || zoom) + 2 });
      }
    } catch (e) {
      console.error("Error zooming into cluster:", e);
    }
  };

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

      {/* Cluster bubbles overlay — only used for the Mappls path, since
          leaflet.markercluster renders its own bubbles natively. */}
      {mapSource === "mappls" &&
        clusterBubbles.map((bubble, i) => (
          <button
            key={i}
            onClick={() => handleBubbleClick(bubble)}
            className="absolute z-[900] flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold shadow-md border-2 border-white cursor-pointer hover:bg-blue-700 transition-colors"
            style={{
              left: bubble.x,
              top: bubble.y,
              width: 36 + Math.min(bubble.count, 40),
              height: 36 + Math.min(bubble.count, 40),
              transform: "translate(-50%, -50%)",
              fontSize: "13px",
            }}
            aria-label={`${bubble.count} vehicles clustered here, click to zoom in`}
          >
            {bubble.count}
          </button>
        ))}

      {mapSource === "osm" && (
        <div className="absolute top-2 right-2 z-[1000] bg-white/90 backdrop-blur-xs text-[11px] font-medium px-2 py-1 rounded shadow text-gray-600 border">
          Map: Live Fleet View (OpenStreetMap)
        </div>
      )}
    </div>
  );
}