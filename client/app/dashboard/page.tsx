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

  // Fetch vehicles from Supabase
  const { data: vehicles, error: vehiclesError } = await supabase
    .from("vehicles")
    .select("id, name, plate_number, status, lat, lng, created_at");

  if (vehiclesError) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">Error Loading Vehicles</h1>
        <p className="mt-2 text-red-600">{vehiclesError.message}</p>
      </main>
    );
  }

  // Transform Supabase data to match VehicleList component interface
  const mappedVehicles = (vehicles || []).map((v) => ({
    id: String(v.id),
    name: v.name,
    registrationNumber: v.plate_number,
    status: (v.status as "active" | "idle" | "offline") || "offline",
    lastKnownLocation: {
      lat: v.lat || 0,
      lng: v.lng || 0,
    },
  }));

  const mapMarkers = mappedVehicles.map((v) => ({
    lat: v.lastKnownLocation.lat,
    lng: v.lastKnownLocation.lng,
    popupHtml: `<b>${v.name}</b><br/>Status: ${v.status}`,
  }));

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Fleet Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              {mappedVehicles.length} vehicles
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
          <Map markers={mapMarkers} height="clamp(260px, 42vw, 460px)" />
        </div>

        <VehicleList vehicles={mappedVehicles} />
      </div>
    </main>
  );
}