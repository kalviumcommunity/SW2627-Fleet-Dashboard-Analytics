"use client";

import { signOut } from "@/app/actions/auth";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
    >
      Sign out
    </button>
  );
}