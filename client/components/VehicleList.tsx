"use client";

import Link from "next/link";
import { useState } from "react";
import StatusBadge from "@/components/StatusBadge";

interface Vehicle {
  id: string;
  name: string;
  registrationNumber: string;
  status: "active" | "idle" | "offline";
  lastKnownLocation: {
    lat: number;
    lng: number;
  };
}

interface VehicleListProps {
  vehicles: Vehicle[];
}

type StatusFilter = "all" | "active" | "idle" | "offline";

export default function VehicleList({ vehicles }: VehicleListProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredVehicles =
    statusFilter === "all"
      ? vehicles
      : vehicles.filter((v) => v.status === statusFilter);

  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "All Vehicles" },
    { value: "active", label: "Active" },
    { value: "idle", label: "Idle" },
    { value: "offline", label: "Offline" },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Vehicle Fleet</h2>

        <div className="flex gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                statusFilter === option.value
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-4 text-sm text-gray-500">
        Showing {filteredVehicles.length} of {vehicles.length} vehicles
      </p>

      {filteredVehicles.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-600">
            No vehicles found with status &quot;{statusFilter}&quot;
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredVehicles.map((vehicle) => (
            <Link
              key={vehicle.id}
              href={`/dashboard/${vehicle.id}`}
              className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                <StatusBadge status={vehicle.status} />
              </div>

              <p className="mt-2 text-sm text-gray-500">
                {vehicle.registrationNumber}
              </p>

              <p className="mt-1 text-xs text-gray-400">{vehicle.id}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
