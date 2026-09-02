import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
 
dotenv.config({ path: ".env.local" });
 
// --- Config ---
const SUPABASE_URL = (process.env.Project_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) as string;
const SERVICE_ROLE_KEY = process.env.service_role_key as string;
const TEST_LIMIT = 100; // test with 100 records first, per today's task
 
if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing Project_URL (or NEXT_PUBLIC_SUPABASE_URL) or service_role_key in .env.local. Check your env file — variable names are case-sensitive."
  );
}
 
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
 
// --- Mock JSON types (shape of mock/vehicles.json and mock/trips.json) ---
interface MockVehicle {
  id: string;
  name: string;
  registrationNumber: string;
  status: string;
  lastKnownLocation: {
    lat: number;
    lng: number;
    timestamp: string;
  };
}
 
interface MockTrip {
  id: string;
  vehicleId: string;
  startTime: string;
  endTime: string;
  startLocation: { lat: number; lng: number };
  endLocation: { lat: number; lng: number };
  distanceKm: number;
}
 
function loadJson<T>(relativePath: string): T[] {
  const fullPath = path.join(process.cwd(), relativePath);
  const raw = fs.readFileSync(fullPath, "utf-8");
  return JSON.parse(raw) as T[];
}
 
async function seed() {
  // --- Load mock data ---
  const allVehicles = loadJson<MockVehicle>("mock/vehicles.json");
  const allTrips = loadJson<MockTrip>("mock/trips.json");
 
  const mockVehicles = allVehicles.slice(0, TEST_LIMIT);
  console.log(`Loaded ${allVehicles.length} mock vehicles, using first ${mockVehicles.length} for this test run.`);
 
  // --- Insert vehicles first ---
  const vehicleRows = mockVehicles.map((v) => ({
    plate_number: v.registrationNumber,
    name: v.name,
    vehicle_type: null, // not present in mock data
    status: v.status,
    owner_id: null, // users table not seeded yet
    lat: v.lastKnownLocation?.lat ?? null,
    lng: v.lastKnownLocation?.lng ?? null,
    location_updated_at: v.lastKnownLocation?.timestamp ?? null,
    created_at: new Date().toISOString(),
  }));
 
  console.log("Inserting vehicles into Supabase...");
  const { data: insertedVehicles, error: vehicleError } = await supabase
    .from("vehicles")
    .insert(vehicleRows)
    .select("id, plate_number");
 
  if (vehicleError) {
    console.error("❌ Vehicle insert failed:", vehicleError.message);
    process.exit(1);
  }
  console.log(`✅ Inserted ${insertedVehicles?.length ?? 0} vehicles.`);
 
  // --- Build old mock id -> new real id map (matched by plate_number/registrationNumber) ---
  const idMap = new Map<string, number>();
  mockVehicles.forEach((mockV, i) => {
    const inserted = insertedVehicles?.[i];
    if (inserted) {
      idMap.set(mockV.id, inserted.id as number);
    }
  });
 
  // --- Filter trips to only those whose vehicle was in this batch, then take first TEST_LIMIT ---
  const tripsForBatch = allTrips.filter((t) => idMap.has(t.vehicleId));
  const mockTrips = tripsForBatch.slice(0, TEST_LIMIT);
  console.log(`Found ${tripsForBatch.length} trips referencing seeded vehicles, using first ${mockTrips.length}.`);
 
  const tripRows = mockTrips.map((t) => ({
    vehicle_id: idMap.get(t.vehicleId),
    driver_id: null, // users table not seeded yet
    start_location: null,
    end_location: null,
    start_lat: t.startLocation?.lat ?? null,
    start_lng: t.startLocation?.lng ?? null,
    end_lat: t.endLocation?.lat ?? null,
    end_lng: t.endLocation?.lng ?? null,
    start_time: t.startTime,
    end_time: t.endTime,
    distance: t.distanceKm,
    status: null,
    created_at: new Date().toISOString(),
  }));
 
  if (tripRows.length === 0) {
    console.log("No trips to insert (no trips referenced the seeded vehicle batch). Skipping trips.");
  } else {
    console.log("Inserting trips into Supabase...");
    const { data: insertedTrips, error: tripError } = await supabase
      .from("trips")
      .insert(tripRows)
      .select();
 
    if (tripError) {
      console.error("❌ Trip insert failed:", tripError.message);
      process.exit(1);
    }
    console.log(`✅ Inserted ${insertedTrips?.length ?? 0} trips.`);
  }
 
  console.log("Done. Go check Supabase Table Editor -> vehicles & trips to confirm.");
}
 
seed();
 