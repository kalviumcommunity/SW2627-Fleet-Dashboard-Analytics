import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/supabase/getUserRole";
import { redirect } from "next/navigation";
import UserRow from "@/components/UserRow";

export default async function AdminPage() {
  const role = await getUserRole();

  if (role !== "admin") {
    redirect("/dashboard");
  }

  const supabase = await createClient();
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, email, role, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="p-8">Failed to load users: {error.message}</p>;
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold">Admin — User Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          {profiles.length} users
        </p>

        <div className="mt-6 overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Joined</th>
                <th className="px-6 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => (
                <UserRow key={profile.id} profile={profile} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}