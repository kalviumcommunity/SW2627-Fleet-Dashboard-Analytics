import vehicles from "@/mock/vehicles.json";
import trips from "@/mock/trips.json";
import Link from "next/link";
import Map from "@/components/Map";

interface PageProps {
  params: Promise<{
    vehicleId: string;
  }>;
}

export default async function VehicleDetailPage({
  params,
}: PageProps) {
  const { vehicleId } = await params;

  const vehicle = vehicles.find(
    (vehicle) => vehicle.id === vehicleId
  );

  if (!vehicle) {
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

  const vehicleTrips = trips.filter(
    (trip) => trip.vehicleId === vehicle.id
  );

  const mapMarkers = [
    {
      lat: vehicle.lastKnownLocation.lat,
      lng: vehicle.lastKnownLocation.lng,
      popupHtml: `<b>${vehicle.name}</b>`,
    },
  ];

  return (
    <main className="p-8 max-w-6xl mx-auto">
      {/* Back button */}
      <Link
        href="/dashboard"
        className="mb-6 inline-block"
      >
        ← Back to Dashboard
      </Link>

      {/* Vehicle Details */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {vehicle.name}
          </h1>
        </div>

        <div className="mb-8">
          <Map 
            markers={mapMarkers} 
            center={{ lat: vehicle.lastKnownLocation.lat, lng: vehicle.lastKnownLocation.lng }} 
            zoom={14} 
            height="300px" 
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
              {vehicle.registrationNumber}
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
              {vehicle.lastKnownLocation.lat},{" "}
              {vehicle.lastKnownLocation.lng}
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
      </section>
    </main>
  );
}