"use client";

import { useState } from "react";
import Link from "next/link";
import vehiclesData from "@/mock/vehicles.json";
import Map from "@/components/Map";

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
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredVehicles =
    statusFilter === "all"
      ? vehiclesData
      : vehiclesData.filter((v) => v.status === statusFilter);

  const mapMarkers = filteredVehicles.map((v) => ({
    lat: v.lastKnownLocation.lat,
    lng: v.lastKnownLocation.lng,
    popupHtml: `<b>${v.name}</b><br/>Status: ${v.status}`,
  }));

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Fleet Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              {filteredVehicles.length} vehicles
            </p>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="idle">Idle</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>

        <div className="mb-8">
          <Map markers={mapMarkers} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredVehicles.map((vehicle) => (
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