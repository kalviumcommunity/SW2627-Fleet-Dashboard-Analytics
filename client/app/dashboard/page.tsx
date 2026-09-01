import Link from "next/link";
import vehicles from "@/mock/vehicles.json";
import Map from "@/components/Map";
import SignOutButton from "@/components/SignOutButton";
import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/supabase/getUserRole";

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    idle: "bg-yellow-100 text-yellow-700",
    offline: "bg-gray-200 text-gray-600",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
        colors[status] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const role = await getUserRole();

  const mapMarkers = vehicles.map((v) => ({
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
              {vehicles.length} vehicles
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

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle) => (
            <Link
              key={vehicle.id}
              href={`/dashboard/${vehicle.id}`}
              className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{vehicle.name}</h2>
                <StatusBadge status={vehicle.status} />
              </div>

              <p className="mt-2 text-sm text-gray-500">
                {vehicle.registrationNumber}
              </p>

              <p className="mt-1 text-xs text-gray-400">{vehicle.id}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}