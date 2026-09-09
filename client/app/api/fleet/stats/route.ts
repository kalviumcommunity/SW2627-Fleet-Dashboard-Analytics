import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/service";
import { getMockVehicles, getMockTrips } from "@/lib/mockData";

export async function GET() {
  try {
    const supabase = getServiceClient();

    if (supabase) {
      const [vehiclesRes, tripsRes] = await Promise.all([
        supabase.from("vehicles").select("status"),
        supabase.from("trips").select("*", { count: "exact", head: true }),
      ]);

      if (!vehiclesRes.error && vehiclesRes.data && vehiclesRes.data.length > 0) {
        const vehicles = vehiclesRes.data;
        const totalVehicles = vehicles.length;
        let active = 0;
        let idle = 0;
        let offline = 0;

        for (const v of vehicles) {
          const s = (v.status || "").toLowerCase();
          if (s === "active") active++;
          else if (s === "offline") offline++;
          else idle++;
        }

        const totalTrips = tripsRes.count || 0;
        const activePercentage =
          totalVehicles > 0 ? Number(((active / totalVehicles) * 100).toFixed(1)) : 0;

        return NextResponse.json({
          success: true,
          source: "supabase",
          timestamp: new Date().toISOString(),
          stats: {
            totalVehicles,
            active,
            idle,
            offline,
            totalTrips,
            activePercentage,
          },
        });
      }
    }

    // Fallback: Local Mock Data
    const mockVehicles = getMockVehicles();
    const mockTrips = getMockTrips();

    let active = 0;
    let idle = 0;
    let offline = 0;

    for (const v of mockVehicles) {
      const s = (v.status || "").toLowerCase();
      if (s === "active") active++;
      else if (s === "offline") offline++;
      else idle++;
    }

    const totalVehicles = mockVehicles.length;
    const totalTrips = mockTrips.length;
    const activePercentage =
      totalVehicles > 0 ? Number(((active / totalVehicles) * 100).toFixed(1)) : 0;

    return NextResponse.json({
      success: true,
      source: "local",
      timestamp: new Date().toISOString(),
      stats: {
        totalVehicles,
        active,
        idle,
        offline,
        totalTrips,
        activePercentage,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to calculate fleet statistics",
      },
      { status: 500 }
    );
  }
}
