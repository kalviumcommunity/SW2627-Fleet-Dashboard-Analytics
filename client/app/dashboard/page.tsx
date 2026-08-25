import Link from "next/link";
import vehicles from "@/mock/vehicles.json";

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

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Fleet Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            {vehicles.length} vehicles
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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