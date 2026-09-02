import Link from "next/link";
import Map from "@/components/Map";
import { createClient } from "@/lib/supabase/server";

interface Trip {
  id: string;
  vehicleId: string;
  startTime: string;
  endTime: string;
  startLocation: { lat: number; lng: number };
  endLocation: { lat: number; lng: number };
  distanceKm: number;
}

interface PageProps {
  params: Promise<{
    vehicleId: string;
  }>;
}

export default async function VehicleDetailPage({
  params,
}: PageProps) {
  const { vehicleId } = await params;
  const supabase = await createClient();

  // Fetch vehicle from Supabase
  const { data: vehicle, error: vehicleError } = await supabase
    .from("vehicles")
    .select("id, name, plate_number, status, lat, lng, created_at")
    .eq("id", parseInt(vehicleId))
    .single();

  if (vehicleError || !vehicle) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">
          Vehicle Not Found
        </h1>

        <p className="mt-2">
          No vehicle exists with ID: {vehicleId}
        </p>

        <Link
          href="/dashboard"
          className="mt-4 inline-block underline"
        >
          Back to Dashboard
        </Link>
      </main>
    );
  }

  // Fetch trips for this vehicle from Supabase
  const { data: tripsData } = await supabase
    .from("trips")
    .select("id, vehicle_id, start_time, end_time, start_lat, start_lng, end_lat, end_lng, distance")
    .eq("vehicle_id", vehicle.id)
    .order("start_time", { ascending: false });

  // Map Supabase trip data to Trip interface
  const vehicleTrips: Trip[] = (tripsData || []).map((t) => ({
    id: String(t.id),
    vehicleId: String(t.vehicle_id),
    startTime: t.start_time,
    endTime: t.end_time,
    startLocation: { lat: t.start_lat || 0, lng: t.start_lng || 0 },
    endLocation: { lat: t.end_lat || 0, lng: t.end_lng || 0 },
    distanceKm: t.distance || 0,
  }));

  const mapMarkers = [
    {
      lat: vehicle.lat || 0,
      lng: vehicle.lng || 0,
      popupHtml: `<b>${vehicle.name}</b>`,
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Back button */}
      <Link
        href="/dashboard"
        className="mb-6 inline-block"
      >
        ← Back to Dashboard
      </Link>

      {/* Vehicle Details */}
      <section className="mb-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold sm:text-3xl">
            {vehicle.name}
          </h1>
        </div>

        <div className="mb-8">
          <Map 
            markers={mapMarkers} 
            center={{ lat: vehicle.lat || 0, lng: vehicle.lng || 0 }} 
            zoom={14} 
            height="clamp(240px, 36vw, 360px)" 
          />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">
              Vehicle ID
            </p>
            <p className="font-medium">
              {vehicle.id}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Registration Number
            </p>
            <p className="font-medium">
              {vehicle.plate_number}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Status
            </p>
            <p className="font-medium capitalize">
              {vehicle.status}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Last Known Location
            </p>

            <p className="font-medium">
              {vehicle.lat}, {vehicle.lng}
            </p>
          </div>
        </div>
      </section>

      {/* Trip History */}
      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold">
            Trip History
          </h2>

          <p className="text-gray-500">
            {vehicleTrips.length} trips found
          </p>
        </div>

        {vehicleTrips.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-gray-600">No trips found for this vehicle</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left">
                    Trip ID
                  </th>

                  <th className="p-3 text-left">
                    Start Time
                  </th>

                  <th className="p-3 text-left">
                    End Time
                  </th>

                  <th className="p-3 text-left">
                    Distance
                  </th>

                  <th className="p-3 text-left">
                    Start Location
                  </th>

                  <th className="p-3 text-left">
                    End Location
                  </th>
                </tr>
              </thead>

              <tbody>
                {vehicleTrips.map((trip) => (
                  <tr
                    key={trip.id}
                    className="border-b"
                  >
                    <td className="p-3">
                      {trip.id}
                    </td>

                    <td className="p-3">
                      {new Date(
                        trip.startTime
                      ).toLocaleString()}
                    </td>

                    <td className="p-3">
                      {new Date(
                        trip.endTime
                      ).toLocaleString()}
                    </td>

                    <td className="p-3">
                      {trip.distanceKm} km
                    </td>

                    <td className="p-3">
                      {trip.startLocation.lat},{" "}
                      {trip.startLocation.lng}
                    </td>

                    <td className="p-3">
                      {trip.endLocation.lat},{" "}
                      {trip.endLocation.lng}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}