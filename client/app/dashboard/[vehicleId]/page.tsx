import vehicles from "@/mock/vehicles.json";
import trips from "@/mock/trips.json";
import Link from "next/link";
import Map from "@/components/Map";
import StatusBadge from "@/components/StatusBadge";

interface Trip {
  id: string;
  vehicleId: string;
  startTime: string;
  endTime: string;
  startLocation: {
    lat: number;
    lng: number;
  };
  endLocation: {
    lat: number;
    lng: number;
  };
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

  // Find vehicle
  const vehicle = vehicles.find(
    (vehicle) => vehicle.id === vehicleId
  );

  // Vehicle not found
  if (!vehicle) {
    return (
      <main className="p-4 sm:p-8">
        <h1 className="text-2xl font-bold">
          Vehicle Not Found
        </h1>

        <p className="mt-2 text-gray-600">
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

  // Get trips for this vehicle
  const vehicleTrips = (trips as Trip[]).filter(
    (trip) => trip.vehicleId === vehicle.id
  );

  // Map marker
  const mapMarkers = [
    {
      lat: vehicle.lastKnownLocation.lat,
      lng: vehicle.lastKnownLocation.lng,
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
          <h1 className="text-2xl font-bold sm:text-3xl">
            {vehicle.name}
          </h1>
        </div>

        {/* Map */}
        <div className="mb-8 w-full overflow-hidden rounded-lg">
          <Map
            markers={mapMarkers}
            center={{
              lat: vehicle.lastKnownLocation.lat,
              lng: vehicle.lastKnownLocation.lng,
            }}
            zoom={14}
            height="clamp(240px, 36vw, 360px)"
          />
        </div>

        {/* Vehicle Information */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Vehicle ID */}
          <div className="min-w-0">
            <p className="text-sm text-gray-500">
              Vehicle ID
            </p>

            <p className="mt-1 break-words font-medium">
              {vehicle.id}
            </p>
          </div>

          {/* Registration Number */}
          <div className="min-w-0">
            <p className="text-sm text-gray-500">
              Registration Number
            </p>

            <p className="mt-1 break-words font-medium">
              {vehicle.registrationNumber}
            </p>
          </div>

          {/* Status */}
          <div>
            <p className="text-sm text-gray-500">
              Status
            </p>

            <div className="mt-1">
              <StatusBadge status={vehicle.status} />
            </div>
          </div>

          {/* Last Known Location */}
          <div className="min-w-0">
            <p className="text-sm text-gray-500">
              Last Known Location
            </p>

            <p className="mt-1 break-words font-medium">
              {vehicle.lastKnownLocation.lat},{" "}
              {vehicle.lastKnownLocation.lng}
            </p>
          </div>
        </div>
      </section>

      {/* Trip History */}
      <section>
        {/* Trip History Heading */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold">
            Trip History
          </h2>

          <p className="mt-1 text-sm text-gray-500 sm:text-base">
            {vehicleTrips.length} trips found
          </p>
        </div>

        {/* Empty State */}
        {vehicleTrips.length === 0 ? (
          <div className="rounded-lg border border-gray-200 p-6 text-center sm:p-8">
            <p className="font-medium text-gray-700">
              No trips recorded yet
            </p>

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
                    <tr
                      key={trip.id}
                      className="border-b last:border-b-0"
                    >
                      {/* Trip ID */}
                      <td className="p-3">
                        {trip.id}
                      </td>

                      {/* Start Time */}
                      <td className="whitespace-nowrap p-3">
                        {new Date(
                          trip.startTime
                        ).toLocaleString()}
                      </td>

                      {/* End Time */}
                      <td className="whitespace-nowrap p-3">
                        {new Date(
                          trip.endTime
                        ).toLocaleString()}
                      </td>

                      {/* Distance */}
                      <td className="whitespace-nowrap p-3">
                        {trip.distanceKm} km
                      </td>

                      {/* Start Location */}
                      <td className="whitespace-nowrap p-3">
                        {trip.startLocation.lat},{" "}
                        {trip.startLocation.lng}
                      </td>

                      {/* End Location */}
                      <td className="whitespace-nowrap p-3">
                        {trip.endLocation.lat},{" "}
                        {trip.endLocation.lng}
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
                  {/* Trip ID */}
                  <div className="mb-4 border-b pb-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Trip ID
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {trip.id}
                    </p>
                  </div>

                  {/* Trip Details */}
                  <div className="space-y-4">
                    {/* Start Time */}
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Start Time
                      </p>

                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(
                          trip.startTime
                        ).toLocaleString()}
                      </p>
                    </div>

                    {/* End Time */}
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        End Time
                      </p>

                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(
                          trip.endTime
                        ).toLocaleString()}
                      </p>
                    </div>

                    {/* Distance */}
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Distance
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {trip.distanceKm} km
                      </p>
                    </div>

                    {/* Start Location */}
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Start Location
                      </p>

                      <p className="mt-1 break-words text-sm text-gray-900">
                        {trip.startLocation.lat},{" "}
                        {trip.startLocation.lng}
                      </p>
                    </div>

                    {/* End Location */}
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        End Location
                      </p>

                      <p className="mt-1 break-words text-sm text-gray-900">
                        {trip.endLocation.lat},{" "}
                        {trip.endLocation.lng}
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