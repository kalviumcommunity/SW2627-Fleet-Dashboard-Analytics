import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/supabase/getUserRole";
import UserRow from "@/components/UserRow";
import AddVehicleForm from "@/components/AddVehicleForm";
import VehicleAdminList from "@/components/VehicleAdminList";
import SignOutButton from "@/components/SignOutButton";

export default async function AdminPage() {
  const role = await getUserRole();

  if (role !== "admin") {
    redirect("/dashboard");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [profilesRes, vehiclesRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, role, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("vehicles")
      .select("id, name, plate_number, status, lat, lng, created_at")
      .order("created_at", { ascending: false }),
  ]);

  const profiles = profilesRes.data || [];
  const vehicles = (vehiclesRes.data || []).map((v) => ({
    id: String(v.id),
    name: v.name,
    plate_number: v.plate_number,
    status: v.status || "offline",
    lat: v.lat ?? null,
    lng: v.lng ?? null,
    created_at: v.created_at ?? null,
  }));

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/dashboard"
              className="mb-2 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition"
            >
              ← Back to Fleet Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Admin Panel
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage fleet vehicles, monitor registrations, and configure user permissions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {user && (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-200">
                {user.email} (Admin)
              </span>
            )}
            <SignOutButton />
          </div>
        </div>

        {/* Section 1: Vehicle Management */}
        <section className="space-y-6">
          <div className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Vehicle Management</h2>
                <p className="mt-0.5 text-sm text-gray-500">
                  Add new vehicles or remove vehicles from the active fleet
                </p>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                {vehicles.length} Total Vehicles
              </span>
            </div>
          </div>

          {/* Add Vehicle Form */}
          <AddVehicleForm />

          {/* Vehicle List with Deletion */}
          <div>
            <h3 className="mb-3 text-base font-semibold text-gray-800">
              Fleet Vehicle Inventory
            </h3>
            {vehiclesRes.error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                Failed to load vehicles: {vehiclesRes.error.message}
              </div>
            ) : (
              <VehicleAdminList vehicles={vehicles} />
            )}
          </div>
        </section>

        {/* Section 2: User Management */}
        <section className="space-y-4 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">User Management</h2>
              <p className="mt-0.5 text-sm text-gray-500">
                Promote or demote user account roles
              </p>
            </div>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
              {profiles.length} Users
            </span>
          </div>

          {profilesRes.error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Failed to load users: {profilesRes.error.message}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-gray-50 text-xs font-medium text-gray-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Role</th>
                    <th className="px-6 py-3 font-medium">Joined</th>
                    <th className="px-6 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {profiles.map((profile) => (
                    <UserRow key={profile.id} profile={profile} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}