"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import StatusBadge from "@/components/StatusBadge";

export interface Vehicle {
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
type SortOption =
  | "name-asc"
  | "name-desc"
  | "reg-asc"
  | "reg-desc"
  | "status"
  | "id-asc"
  | "id-desc";

export default function VehicleList({ vehicles }: VehicleListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);

  // Reset to page 1 whenever filters or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortBy, pageSize]);

  // Status counts for badge indicators
  const counts = useMemo(() => {
    return {
      all: vehicles.length,
      active: vehicles.filter((v) => v.status === "active").length,
      idle: vehicles.filter((v) => v.status === "idle").length,
      offline: vehicles.filter((v) => v.status === "offline").length,
    };
  }, [vehicles]);

  const statusOptions: { value: StatusFilter; label: string; count: number }[] = [
    { value: "all", label: "All Vehicles", count: counts.all },
    { value: "active", label: "Active", count: counts.active },
    { value: "idle", label: "Idle", count: counts.idle },
    { value: "offline", label: "Offline", count: counts.offline },
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "name-asc", label: "Name (A → Z)" },
    { value: "name-desc", label: "Name (Z → A)" },
    { value: "reg-asc", label: "Plate / Reg (A → Z)" },
    { value: "reg-desc", label: "Plate / Reg (Z → A)" },
    { value: "status", label: "Status (Active first)" },
    { value: "id-asc", label: "ID (Ascending)" },
    { value: "id-desc", label: "ID (Descending)" },
  ];

  const filteredAndSortedVehicles = useMemo(() => {
    // 1. Filter by status & search query
    const filtered = vehicles.filter((v) => {
      const matchesStatus =
        statusFilter === "all" || v.status === statusFilter;

      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.registrationNumber.toLowerCase().includes(q) ||
        v.id.toLowerCase().includes(q);

      return matchesStatus && matchesQuery;
    });

    // 2. Sort results
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
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
          return a.registrationNumber.localeCompare(
            b.registrationNumber,
            undefined,
            { numeric: true, sensitivity: "base" }
          );
        case "reg-desc":
          return b.registrationNumber.localeCompare(
            a.registrationNumber,
            undefined,
            { numeric: true, sensitivity: "base" }
          );
        case "status": {
          const priority: Record<string, number> = {
            active: 1,
            idle: 2,
            offline: 3,
          };
          const pA = priority[a.status] ?? 99;
          const pB = priority[b.status] ?? 99;
          if (pA !== pB) return pA - pB;
          return a.name.localeCompare(b.name);
        }
        case "id-asc":
          return a.id.localeCompare(b.id, undefined, { numeric: true });
        case "id-desc":
          return b.id.localeCompare(a.id, undefined, { numeric: true });
        default:
          return 0;
      }
    });
  }, [vehicles, statusFilter, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedVehicles.length / pageSize));
  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedVehicles.slice(start, start + pageSize);
  }, [filteredAndSortedVehicles, currentPage, pageSize]);

  const hasActiveFilters = searchQuery.trim() !== "" || statusFilter !== "all";

  function handleResetFilters() {
    setSearchQuery("");
    setStatusFilter("all");
    setSortBy("name-asc");
    setCurrentPage(1);
  }

  return (
    <div className="space-y-6">
      {/* Controls: Search, Filter, and Sort */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
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
              placeholder="Search by vehicle name, plate number, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-8 text-xs text-gray-900 placeholder-gray-400 shadow-xs focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
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

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="vehicle-sort-select"
              className="text-xs font-medium text-gray-600 whitespace-nowrap"
            >
              Sort by:
            </label>
            <select
              id="vehicle-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-xs focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status filter tabs & active count */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {statusOptions.map((option) => {
              const isActive = statusFilter === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>{option.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                      isActive
                        ? "bg-blue-700 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {option.count.toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>
              Showing{" "}
              <strong className="font-semibold text-gray-700">
                {filteredAndSortedVehicles.length.toLocaleString()}
              </strong>{" "}
              of {vehicles.length.toLocaleString()} vehicles
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-blue-600 hover:underline cursor-pointer font-medium"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Vehicle Grid */}
      {filteredAndSortedVehicles.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center sm:p-12">
          <p className="text-base font-semibold text-gray-700">No vehicles found</p>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery
              ? `No vehicles matched your search "${searchQuery}".`
              : `No vehicles found with status "${statusFilter}".`}
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-xs hover:bg-blue-700 transition cursor-pointer"
            >
              Clear filters and search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {paginatedVehicles.map((vehicle) => (
              <Link
                key={vehicle.id}
                href={`/dashboard/${vehicle.id}`}
                className="group rounded-xl border border-gray-200 bg-white p-5 shadow-xs transition hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {vehicle.name}
                  </h3>
                  <StatusBadge status={vehicle.status} />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span className="font-mono uppercase font-medium text-gray-700">
                    {vehicle.registrationNumber}
                  </span>
                  <span className="text-gray-400">ID: {vehicle.id}</span>
                </div>

                <div className="mt-3 border-t border-gray-100 pt-3 text-[11px] text-gray-500 flex items-center justify-between">
                  <span>
                    {vehicle.lastKnownLocation?.lat && vehicle.lastKnownLocation?.lng
                      ? `Loc: ${vehicle.lastKnownLocation.lat.toFixed(3)}, ${vehicle.lastKnownLocation.lng.toFixed(3)}`
                      : "No location"}
                  </span>
                  <span className="text-blue-600 font-medium group-hover:underline">
                    View Trips →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          {filteredAndSortedVehicles.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-4 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span>
                  Showing{" "}
                  <strong>
                    {((currentPage - 1) * pageSize + 1).toLocaleString()}
                  </strong>{" "}
                  to{" "}
                  <strong>
                    {Math.min(currentPage * pageSize, filteredAndSortedVehicles.length).toLocaleString()}
                  </strong>{" "}
                  of{" "}
                  <strong>
                    {filteredAndSortedVehicles.length.toLocaleString()}
                  </strong>{" "}
                  vehicles
                </span>

                <span className="text-gray-300">|</span>

                <label htmlFor="page-size-select" className="sr-only">
                  Vehicles per page
                </label>
                <select
                  id="page-size-select"
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="rounded border border-gray-300 bg-white px-2 py-1 text-xs cursor-pointer"
                >
                  <option value={30}>30 per page</option>
                  <option value={60}>60 per page</option>
                  <option value={120}>120 per page</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="rounded border border-gray-300 bg-white px-2.5 py-1 font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  « First
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded border border-gray-300 bg-white px-2.5 py-1 font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  ‹ Prev
                </button>

                <span className="px-3 py-1 font-semibold text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded border border-gray-300 bg-white px-2.5 py-1 font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next ›
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="rounded border border-gray-300 bg-white px-2.5 py-1 font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Last »
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
