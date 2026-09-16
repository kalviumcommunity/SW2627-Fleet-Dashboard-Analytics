"use client";

import { useState, useTransition } from "react";
import { updateUserRole } from "@/app/actions/admin";

interface Profile {
  id: string;
  email: string;
  role: string;
  created_at: string;
  last_sign_in_at?: string | null;
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
    <tr className="border-b last:border-b-0 hover:bg-gray-50/50 transition">
      <td className="px-6 py-4">{profile.email}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${profile.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'} capitalize`}>
          {profile.role}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col text-xs text-gray-500">
          <span>Signed up: {new Date(profile.created_at).toLocaleDateString()}</span>
          <span>Last login: {profile.last_sign_in_at ? new Date(profile.last_sign_in_at).toLocaleString() : 'Never'}</span>
        </div>
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