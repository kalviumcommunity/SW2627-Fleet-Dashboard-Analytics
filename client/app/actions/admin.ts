"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateUserRole(userId: string, newRole: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId);

  if (error) {
    throw new Error(`Failed to update user role: ${error.message}`);
  }

  return { success: true };
}
