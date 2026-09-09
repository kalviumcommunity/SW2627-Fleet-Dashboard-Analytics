import fs from "fs";
import path from "path";

export interface VehicleRecord {
  id: string | number;
  name: string;
  registrationNumber?: string;
  plate_number?: string;
  status: "active" | "idle" | "offline" | string;
  lastKnownLocation?: {
    lat: number;
    lng: number;
    timestamp: string;
  };
  lat?: number;
  lng?: number;
  location_updated_at?: string;
  created_at?: string;
}

export interface TripRecord {
  id: string | number;
  vehicleId?: string | number;
  vehicle_id?: string | number;
  startTime?: string;
  start_time?: string;
  endTime?: string;
  end_time?: string;
  startLocation?: { lat: number; lng: number };
  endLocation?: { lat: number; lng: number };
  start_lat?: number;
  start_lng?: number;
  end_lat?: number;
  end_lng?: number;
  distanceKm?: number;
  distance?: number;
  status?: string | null;
  created_at?: string;
}

let cachedVehicles: VehicleRecord[] | null = null;
let cachedTrips: TripRecord[] | null = null;

function resolveFilePath(fileName: string): string | null {
  const directPath = path.join(process.cwd(), "mock", fileName);
  if (fs.existsSync(directPath)) return directPath;

  const nestedPath = path.join(process.cwd(), "client", "mock", fileName);
  if (fs.existsSync(nestedPath)) return nestedPath;

  const scriptRelative = path.resolve(__dirname, "..", "..", "mock", fileName);
  if (fs.existsSync(scriptRelative)) return scriptRelative;

  return null;
}

export function getMockVehicles(): VehicleRecord[] {
  if (cachedVehicles) return cachedVehicles;

  const filePath = resolveFilePath("vehicles.json");
  if (!filePath) return [];

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    cachedVehicles = JSON.parse(raw);
    return cachedVehicles || [];
  } catch (err) {
    console.error("Error reading mock vehicles:", err);
    return [];
  }
}

export function getMockTrips(): TripRecord[] {
  if (cachedTrips) return cachedTrips;

  const filePath = resolveFilePath("trips.json");
  if (!filePath) return [];

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    cachedTrips = JSON.parse(raw);
    return cachedTrips || [];
  } catch (err) {
    console.error("Error reading mock trips:", err);
    return [];
  }
}
