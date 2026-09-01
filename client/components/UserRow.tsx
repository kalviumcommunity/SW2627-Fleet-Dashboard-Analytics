"use client";

import { useState, useTransition } from "react";
import { updateUserRole } from "@/app/actions/admin";

interface Profile {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export default function UserRow({ profile }: { profile: Profile }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleToggle() {
    const newRole = profile.role === "admin" ? "viewer" : "admin";
    setError(null);

    startTransition(async () => {
      try {
        await updateUserRole(profile.id, newRole);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update role");
      }
    });
  }

  return (
    <tr className="border-b last:border-b-0">
      <td className="px-6 py-4">{profile.email}</td>
      <td className="px-6 py-4 capitalize">{profile.role}</td>
      <td className="px-6 py-4">
        {new Date(profile.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4">
        <button
          onClick={handleToggle}
          disabled={isPending}
          className="rounded-lg border px-3 py-1 text-xs font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          {isPending
            ? "Updating..."
            : profile.role === "admin"
            ? "Demote to Viewer"
            : "Promote to Admin"}
        </button>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </td>
    </tr>
  );
}