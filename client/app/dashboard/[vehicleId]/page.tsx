import Link from "next/link";
import Map from "@/components/Map";
import StatusBadge from "@/components/StatusBadge";
import { createClient } from "@/lib/supabase/server";

interface PageProps {
  params: Promise<{
    vehicleId: string;
  }>;
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { vehicleId } = await params;
  const supabase = await createClient();

  // Fetch the vehicle from Supabase
  const { data: vehicle, error: vehicleError } = await supabase
    .from("vehicles")
    .select("id, name, plate_number, status, lat, lng, created_at")
    .eq("id", vehicleId)
    .single();

  // Vehicle not found (or invalid id / query error)
  if (vehicleError || !vehicle) {
    return (
      <main className="p-4 sm:p-8">
        <h1 className="text-2xl font-bold">Vehicle Not Found</h1>

        <p className="mt-2 text-gray-600">
          No vehicle exists with ID: {vehicleId}
        </p>

        <Link href="/dashboard" className="mt-4 inline-block underline">
          Back to Dashboard
        </Link>
      </main>
    );
  }

  // Fetch trips for this vehicle from Supabase
  const { data: tripsData, error: tripsError } = await supabase
    .from("trips")
    .select(
      "id, start_time, end_time, distance, start_lat, start_lng, end_lat, end_lng, status"
    )
    .eq("vehicle_id", vehicle.id)
    .order("start_time", { ascending: false });

  if (tripsError) {
    return (
      <main className="p-4 sm:p-8">
        <h1 className="text-2xl font-bold">Error Loading Trips</h1>
        <p className="mt-2 text-red-600">{tripsError.message}</p>
      </main>
    );
  }

  const vehicleTrips = tripsData || [];

  // Map marker for this vehicle's last known location
  const mapMarkers = [
    {
      lat: vehicle.lat || 0,
      lng: vehicle.lng || 0,
      popupHtml: `<b>${vehicle.name}</b>`,
    },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Back button */}
      <Link
        href="/dashboard"
        className="mb-6 inline-block text-sm font-medium hover:underline sm:text-base"
      >
        ← Back to Dashboard
      </Link>

      {/* Vehicle Details */}
      <section className="mb-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold sm:text-3xl">{vehicle.name}</h1>
        </div>

        {/* Map */}
        <div className="mb-8 w-full overflow-hidden rounded-lg">
          <Map
            markers={mapMarkers}
            center={{
              lat: vehicle.lat || 0,
              lng: vehicle.lng || 0,
            }}
            zoom={14}
            height="clamp(240px, 36vw, 360px)"
          />
        </div>

        {/* Vehicle Information */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Vehicle ID */}
          <div className="min-w-0">
            <p className="text-sm text-gray-500">Vehicle ID</p>
            <p className="mt-1 break-words font-medium">{vehicle.id}</p>
          </div>

          {/* Registration Number */}
          <div className="min-w-0">
            <p className="text-sm text-gray-500">Registration Number</p>
            <p className="mt-1 break-words font-medium">
              {vehicle.plate_number}
            </p>
          </div>

          {/* Status */}
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <div className="mt-1">
              <StatusBadge status={vehicle.status} />
            </div>
          </div>

          {/* Last Known Location */}
          <div className="min-w-0">
            <p className="text-sm text-gray-500">Last Known Location</p>
            <p className="mt-1 break-words font-medium">
              {vehicle.lat}, {vehicle.lng}
            </p>
          </div>
        </div>
      </section>

      {/* Trip History */}
      <section>
        {/* Trip History Heading */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Trip History</h2>
          <p className="mt-1 text-sm text-gray-500 sm:text-base">
            {vehicleTrips.length} trips found
          </p>
        </div>

        {/* Empty State */}
        {vehicleTrips.length === 0 ? (
          <div className="rounded-lg border border-gray-200 p-6 text-center sm:p-8">
            <p className="font-medium text-gray-700">No trips recorded yet</p>
            <p className="mt-1 text-sm text-gray-500">
              There are no trips available for this vehicle.
            </p>
          </div>
        ) : (
          <>
            {/* ================================ */}
            {/* DESKTOP TABLE */}
            {/* ================================ */}
            <div className="hidden overflow-x-auto rounded-lg border border-gray-200 md:block">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-3 text-left text-sm font-semibold">
                      Trip ID
                    </th>
                    <th className="p-3 text-left text-sm font-semibold">
                      Start Time
                    </th>
                    <th className="p-3 text-left text-sm font-semibold">
                      End Time
                    </th>
                    <th className="p-3 text-left text-sm font-semibold">
                      Distance
                    </th>
                    <th className="p-3 text-left text-sm font-semibold">
                      Start Location
                    </th>
                    <th className="p-3 text-left text-sm font-semibold">
                      End Location
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {vehicleTrips.map((trip) => (
                    <tr key={trip.id} className="border-b last:border-b-0">
                      <td className="p-3">{trip.id}</td>

                      <td className="whitespace-nowrap p-3">
                        {trip.start_time
                          ? new Date(trip.start_time).toLocaleString()
                          : "—"}
                      </td>

                      <td className="whitespace-nowrap p-3">
                        {trip.end_time
                          ? new Date(trip.end_time).toLocaleString()
                          : "—"}
                      </td>

                      <td className="whitespace-nowrap p-3">
                        {trip.distance != null ? `${trip.distance} km` : "—"}
                      </td>

                      <td className="whitespace-nowrap p-3">
                        {trip.start_lat != null && trip.start_lng != null
                          ? `${trip.start_lat}, ${trip.start_lng}`
                          : "—"}
                      </td>

                      <td className="whitespace-nowrap p-3">
                        {trip.end_lat != null && trip.end_lng != null
                          ? `${trip.end_lat}, ${trip.end_lng}`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ================================ */}
            {/* MOBILE CARDS */}
            {/* ================================ */}
            <div className="space-y-4 md:hidden">
              {vehicleTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-4 border-b pb-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Trip ID
                    </p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {trip.id}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Start Time
                      </p>
                      <p className="mt-1 text-sm text-gray-900">
                        {trip.start_time
                          ? new Date(trip.start_time).toLocaleString()
                          : "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        End Time
                      </p>
                      <p className="mt-1 text-sm text-gray-900">
                        {trip.end_time
                          ? new Date(trip.end_time).toLocaleString()
                          : "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Distance
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {trip.distance != null ? `${trip.distance} km` : "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Start Location
                      </p>
                      <p className="mt-1 break-words text-sm text-gray-900">
                        {trip.start_lat != null && trip.start_lng != null
                          ? `${trip.start_lat}, ${trip.start_lng}`
                          : "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        End Location
                      </p>
                      <p className="mt-1 break-words text-sm text-gray-900">
                        {trip.end_lat != null && trip.end_lng != null
                          ? `${trip.end_lat}, ${trip.end_lng}`
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}