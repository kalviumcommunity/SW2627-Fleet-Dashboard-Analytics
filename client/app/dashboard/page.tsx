import Link from "next/link";
import Map from "@/components/Map";
import SignOutButton from "@/components/SignOutButton";
import VehicleList from "@/components/VehicleList";
import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/supabase/getUserRole";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const role = await getUserRole();

  // 1. Fetch total count of vehicles from Supabase
  const { count, error: countError } = await supabase
    .from("vehicles")
    .select("*", { count: "exact", head: true });

  if (countError) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">Error Loading Vehicles</h1>
        <p className="mt-2 text-red-600">{countError.message}</p>
      </main>
    );
  }

  // Supabase PostgREST limits single queries to 1000 rows.
  // Fetch in parallel chunks of 1000 to retrieve the entire fleet.
  const totalCount = count || 0;
  const CHUNK_SIZE = 1000;
  const totalPages = Math.ceil(totalCount / CHUNK_SIZE);

  let vehicles: any[] = [];
  if (totalPages > 0) {
    const pagePromises = [];
    for (let i = 0; i < totalPages; i++) {
      const from = i * CHUNK_SIZE;
      const to = from + CHUNK_SIZE - 1;
      pagePromises.push(
        supabase
          .from("vehicles")
          .select("id, name, plate_number, status, lat, lng, created_at")
          .order("id", { ascending: true })
          .range(from, to)
      );
    }
    const results = await Promise.all(pagePromises);
    for (const res of results) {
      if (res.data) {
        vehicles.push(...res.data);
      }
    }
  }

  // Transform Supabase data to match VehicleList component interface
  const mappedVehicles = vehicles.map((v) => ({
    id: String(v.id),
    name: v.name,
    registrationNumber: v.plate_number,
    status: (v.status as "active" | "idle" | "offline") || "offline",
    lastKnownLocation: {
      lat: v.lat || 0,
      lng: v.lng || 0,
    },
  }));

  // Map markers for all vehicles with valid coordinates in the fleet
  const mapMarkers = mappedVehicles
    .filter((v) => v.lastKnownLocation.lat !== 0 && v.lastKnownLocation.lng !== 0)
    .map((v) => ({
      lat: v.lastKnownLocation.lat,
      lng: v.lastKnownLocation.lng,
      popupHtml: `<b>${v.name}</b><br/>Plate: ${v.registrationNumber}<br/>Status: ${v.status}`,
    }));

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Fleet Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              {mappedVehicles.length.toLocaleString()} vehicles in fleet
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
            {user && (
              <span className="text-sm text-gray-500">
                {user.email} {role && `(${role})`}
              </span>
            )}
            {role === "admin" && (
              <Link
                href="/dashboard/admin"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Admin Panel
              </Link>
            )}
            <SignOutButton />
          </div>
        </div>

        <div className="mb-8">
          <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 gap-1">
            <span className="font-medium text-gray-700">Live Fleet Map</span>
            <span>
              All {mapMarkers.length.toLocaleString()} vehicles plotted on map with red pointers
            </span>
          </div>
          <Map markers={mapMarkers} height="clamp(260px, 42vw, 460px)" />
        </div>

        <VehicleList vehicles={mappedVehicles} />
      </div>
    </main>
  );
}