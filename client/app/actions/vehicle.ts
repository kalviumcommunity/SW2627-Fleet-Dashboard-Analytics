"use server";

import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/supabase/getUserRole";
import { revalidatePath } from "next/cache";

export async function deleteVehicle(vehicleId: string) {
  const role = await getUserRole();

  if (role !== "admin") {
    throw new Error("Unauthorized: only admins can delete vehicles.");
  }

  const supabase = await createClient();

  // Clean up associated trips first if any exist to prevent foreign key constraint violations
  await supabase.from("trips").delete().eq("vehicle_id", vehicleId);

  const { error } = await supabase.from("vehicles").delete().eq("id", vehicleId);

  if (error) {
    throw new Error(`Failed to delete vehicle: ${error.message}`);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/admin");
  return { success: true };
}

export interface AddVehicleInput {
  name: string;
  registrationNumber: string;
  status: "active" | "idle" | "offline";
  lat: number;
  lng: number;
}

export async function addVehicle(input: AddVehicleInput) {
  const role = await getUserRole();

  if (role !== "admin") {
    throw new Error("Unauthorized: only admins can add vehicles.");
  }

  const supabase = await createClient();

  const { error } = await supabase.from("vehicles").insert({
    name: input.name,
    plate_number: input.registrationNumber,
    status: input.status,
    lat: input.lat,
    lng: input.lng,
    location_updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(`Failed to add vehicle: ${error.message}`);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/admin");
  return { success: true };
}