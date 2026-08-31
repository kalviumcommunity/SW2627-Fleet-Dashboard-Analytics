"use server";

import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/supabase/getUserRole";

export async function deleteVehicle(vehicleId: string) {
  const role = await getUserRole();

  if (role !== "admin") {
    throw new Error("Unauthorized: only admins can delete vehicles.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("vehicles").delete().eq("id", vehicleId);

  if (error) {
    throw new Error(`Failed to delete vehicle: ${error.message}`);
  }

  return { success: true };
}