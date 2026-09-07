"use client";

import { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import VehicleAdminRow, { AdminVehicle } from "@/components/VehicleAdminRow";
import { deleteVehicle } from "@/app/actions/vehicle";

interface VehicleAdminListProps {
  vehicles: AdminVehicle[];
}

type StatusFilter = "all" | "active" | "idle" | "offline";
type SortOption =
  | "created-desc"
  | "created-asc"
  | "name-asc"
  | "name-desc"
  | "reg-asc"
  | "reg-desc"
  | "status"
  | "id-asc";

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
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
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
  const [sortBy, setSortBy] = useState<SortOption>("created-desc");

  // Status counts for badge indicators
  const counts = useMemo(() => {
    return {
      all: vehicles.length,
      active: vehicles.filter((v) => v.status?.toLowerCase() === "active").length,
      idle: vehicles.filter((v) => v.status?.toLowerCase() === "idle").length,
      offline: vehicles.filter((v) => v.status?.toLowerCase() === "offline").length,
    };
  }, [vehicles]);

  const statusOptions: { value: StatusFilter; label: string; count: number }[] = [
    { value: "all", label: "All", count: counts.all },
    { value: "active", label: "Active", count: counts.active },
    { value: "idle", label: "Idle", count: counts.idle },
    { value: "offline", label: "Offline", count: counts.offline },
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "created-desc", label: "Newest First" },
    { value: "created-asc", label: "Oldest First" },
    { value: "name-asc", label: "Name (A → Z)" },
    { value: "name-desc", label: "Name (Z → A)" },
    { value: "reg-asc", label: "Plate / Reg (A → Z)" },
    { value: "reg-desc", label: "Plate / Reg (Z → A)" },
    { value: "status", label: "Status (Active first)" },
    { value: "id-asc", label: "ID (Ascending)" },
  ];

  const filteredAndSortedVehicles = useMemo(() => {
    const filtered = vehicles.filter((v) => {
      const matchesStatus =
        statusFilter === "all" || v.status?.toLowerCase() === statusFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        v.name?.toLowerCase().includes(q) ||
        v.plate_number?.toLowerCase().includes(q) ||
        String(v.id).toLowerCase().includes(q);

      return matchesStatus && matchesQuery;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "created-desc":
          return (
            new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime()
          );
        case "created-asc":
          return (
            new Date(a.created_at || 0).getTime() -
            new Date(b.created_at || 0).getTime()
          );
        case "name-asc":
          return a.name.localeCompare(b.name, undefined, {
            numeric: true,
            sensitivity: "base",
          });
        case "name-desc":
          return b.name.localeCompare(a.name, undefined, {
            numeric: true,
            sensitivity: "base",
          });
        case "reg-asc":
          return a.plate_number.localeCompare(b.plate_number, undefined, {
            numeric: true,
            sensitivity: "base",
          });
        case "reg-desc":
          return b.plate_number.localeCompare(a.plate_number, undefined, {
            numeric: true,
            sensitivity: "base",
          });
        case "status": {
          const priority: Record<string, number> = {
            active: 1,
            idle: 2,
            offline: 3,
          };
          const pA = priority[a.status?.toLowerCase() || ""] ?? 99;
          const pB = priority[b.status?.toLowerCase() || ""] ?? 99;
          if (pA !== pB) return pA - pB;
          return a.name.localeCompare(b.name);
        }
        case "id-asc":
          return String(a.id).localeCompare(String(b.id), undefined, {
            numeric: true,
          });
        default:
          return 0;
      }
    });
  }, [vehicles, statusFilter, searchQuery, sortBy]);

  const hasActiveFilters = searchQuery.trim() !== "" || statusFilter !== "all";

  function handleResetFilters() {
    setSearchQuery("");
    setStatusFilter("all");
    setSortBy("created-desc");
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, plate number, or ID..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-8 text-sm placeholder-gray-400 shadow-xs focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status filters */}
          <div className="flex flex-wrap gap-1.5">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                  statusFilter === opt.value
                    ? "bg-blue-600 text-white shadow-xs"
                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{opt.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${
                    statusFilter === opt.value
                      ? "bg-blue-700 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {opt.count}
                </span>
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="admin-sort" className="text-xs text-gray-500 whitespace-nowrap">
              Sort:
            </label>
            <select
              id="admin-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-xs focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          Showing{" "}
          <strong className="font-semibold text-gray-700">
            {filteredAndSortedVehicles.length}
          </strong>{" "}
          of {vehicles.length} vehicles
        </span>
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="text-blue-600 hover:underline cursor-pointer font-medium"
          >
            Reset Filters
          </button>
        )}
      </div>

      {filteredAndSortedVehicles.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-sm font-medium text-gray-600">No vehicles found</p>
          <p className="mt-1 text-xs text-gray-400">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search query or status filter."
              : "No vehicles in the database yet. Add one above!"}
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="mt-3 inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-blue-700 transition cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-xs md:block">
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
                {filteredAndSortedVehicles.map((vehicle) => (
                  <VehicleAdminRow key={vehicle.id} vehicle={vehicle} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filteredAndSortedVehicles.map((vehicle) => (
              <VehicleAdminCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
