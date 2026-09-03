"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import VehicleAdminRow, { AdminVehicle } from "@/components/VehicleAdminRow";
import { deleteVehicle } from "@/app/actions/vehicle";

interface VehicleAdminListProps {
  vehicles: AdminVehicle[];
}

type StatusFilter = "all" | "active" | "idle" | "offline";

function VehicleAdminCard({ vehicle }: { vehicle: AdminVehicle }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    const confirmMessage = `Are you sure you want to delete vehicle "${vehicle.name}" (${vehicle.plate_number})?`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        await deleteVehicle(String(vehicle.id));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete vehicle");
      }
    });
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
          <p className="font-mono text-xs uppercase text-gray-500">{vehicle.plate_number}</p>
        </div>
        <StatusBadge status={vehicle.status || "offline"} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
        <div>
          <span className="font-medium text-gray-700">ID:</span> {vehicle.id}
        </div>
        <div>
          <span className="font-medium text-gray-700">Location:</span>{" "}
          {vehicle.lat != null && vehicle.lng != null
            ? `${vehicle.lat.toFixed(2)}, ${vehicle.lng.toFixed(2)}`
            : "N/A"}
        </div>
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      <div className="mt-4 flex items-center justify-end gap-2 border-t pt-3">
        <Link
          href={`/dashboard/${vehicle.id}`}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          View Details
        </Link>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50 transition cursor-pointer"
        >
          {isPending ? "Deleting..." : "Delete Vehicle"}
        </button>
      </div>
    </div>
  );
}

export default function VehicleAdminList({ vehicles }: VehicleAdminListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredVehicles = vehicles.filter((v) => {
    const matchesStatus = statusFilter === "all" || v.status?.toLowerCase() === statusFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      v.name?.toLowerCase().includes(q) ||
      v.plate_number?.toLowerCase().includes(q) ||
      String(v.id).toLowerCase().includes(q);

    return matchesStatus && matchesQuery;
  });

  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "idle", label: "Idle" },
    { value: "offline", label: "Offline" },
  ];

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, plate number, or ID..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-xs text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                statusFilter === opt.value
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          Showing {filteredVehicles.length} of {vehicles.length} vehicles
        </span>
      </div>

      {filteredVehicles.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-sm font-medium text-gray-600">No vehicles found</p>
          <p className="mt-1 text-xs text-gray-400">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search query or status filter."
              : "No vehicles in the database yet. Add one above!"}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50 text-xs font-medium text-gray-500">
                <tr>
                  <th className="px-6 py-3">Vehicle</th>
                  <th className="px-6 py-3">Plate / Reg Number</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredVehicles.map((vehicle) => (
                  <VehicleAdminRow key={vehicle.id} vehicle={vehicle} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filteredVehicles.map((vehicle) => (
              <VehicleAdminCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
