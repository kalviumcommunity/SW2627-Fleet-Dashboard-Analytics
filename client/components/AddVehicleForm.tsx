"use client";

import { useState, useTransition } from "react";
import { addVehicle } from "@/app/actions/vehicle";

export default function AddVehicleForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("name") as string)?.trim();
    const registrationNumber = (formData.get("registrationNumber") as string)?.trim();
    const status = formData.get("status") as "active" | "idle" | "offline";
    const latStr = formData.get("lat") as string;
    const lngStr = formData.get("lng") as string;

    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    if (!name || !registrationNumber) {
      setError("Vehicle name and registration number are required.");
      return;
    }

    if (isNaN(lat) || isNaN(lng)) {
      setError("Please provide valid latitude and longitude numbers.");
      return;
    }

    startTransition(async () => {
      try {
        await addVehicle({ name, registrationNumber, status, lat, lng });
        setSuccess(true);
        form.reset();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add vehicle");
      }
    });
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Add New Vehicle</h2>
          <p className="text-xs text-gray-500">Register a new vehicle to the fleet</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Vehicle Name */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Vehicle Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder="e.g. Express Van 101"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Registration Number */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Registration / Plate Number <span className="text-red-500">*</span>
            </label>
            <input
              name="registrationNumber"
              type="text"
              required
              placeholder="e.g. RJ14AB1234"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase"
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Initial Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              required
              defaultValue="active"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="idle">Idle</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          {/* Latitude */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Initial Latitude <span className="text-red-500">*</span>
            </label>
            <input
              name="lat"
              type="number"
              step="any"
              required
              placeholder="e.g. 26.9124"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Longitude */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Initial Longitude <span className="text-red-500">*</span>
            </label>
            <input
              name="lng"
              type="number"
              step="any"
              required
              placeholder="e.g. 75.7873"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Feedback messages */}
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-200">
            Vehicle created successfully!
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition cursor-pointer"
          >
            {isPending ? "Adding Vehicle..." : "Add Vehicle"}
          </button>
        </div>
      </form>
    </div>
  );
}
