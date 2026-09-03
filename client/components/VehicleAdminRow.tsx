"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { deleteVehicle } from "@/app/actions/vehicle";

export interface AdminVehicle {
  id: string | number;
  name: string;
  plate_number: string;
  status: string;
  lat: number | null;
  lng: number | null;
  created_at?: string | null;
}

interface VehicleAdminRowProps {
  vehicle: AdminVehicle;
}

export default function VehicleAdminRow({ vehicle }: VehicleAdminRowProps) {
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
    <tr className="border-b last:border-b-0 hover:bg-gray-50/50 transition">
      {/* Name & ID */}
      <td className="px-6 py-4">
        <div className="font-medium text-gray-900">{vehicle.name}</div>
        <div className="text-xs text-gray-400">ID: {vehicle.id}</div>
      </td>

      {/* Plate / Registration Number */}
      <td className="px-6 py-4 font-mono text-xs uppercase text-gray-700">
        {vehicle.plate_number}
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <StatusBadge status={vehicle.status || "offline"} />
      </td>

      {/* Location */}
      <td className="px-6 py-4 text-xs text-gray-600">
        {vehicle.lat != null && vehicle.lng != null ? (
          <span>
            {vehicle.lat.toFixed(4)}, {vehicle.lng.toFixed(4)}
          </span>
        ) : (
          <span className="text-gray-400">N/A</span>
        )}
      </td>

      {/* Created / Added Date */}
      <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
        {vehicle.created_at
          ? new Date(vehicle.created_at).toLocaleDateString()
          : "—"}
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/${vehicle.id}`}
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            View
          </Link>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50 transition cursor-pointer"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </td>
    </tr>
  );
}
