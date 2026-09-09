import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/service";
import { getMockVehicles, getMockTrips } from "@/lib/mockData";

interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteProps) {
  try {
    const { id } = await params;
    const supabase = getServiceClient();

    // 1. Check Supabase
    if (supabase) {
      const isNumeric = /^\d+$/.test(id);
      let query = supabase.from("vehicles").select("*");

      if (isNumeric) {
        query = query.eq("id", parseInt(id, 10));
      } else {
        query = query.or(`plate_number.eq.${id},name.ilike.%${id}%`);
      }

      const { data: vehicle, error } = await query.maybeSingle();

      if (!error && vehicle) {
        const { data: trips } = await supabase
          .from("trips")
          .select("*")
          .eq("vehicle_id", vehicle.id)
          .order("start_time", { ascending: false })
          .limit(50);

        return NextResponse.json({
          success: true,
          source: "supabase",
          vehicle: {
            id: vehicle.id,
            name: vehicle.name,
            registrationNumber: vehicle.plate_number,
            status: vehicle.status,
            lastKnownLocation: {
              lat: vehicle.lat,
              lng: vehicle.lng,
              timestamp: vehicle.location_updated_at || vehicle.created_at,
            },
          },
          trips: trips || [],
        });
      }
    }

    // 2. Fallback: Mock Data
    const allMock = getMockVehicles();
    const vehicle = allMock.find(
      (v) =>
        String(v.id).toLowerCase() === id.toLowerCase() ||
        (v.registrationNumber && v.registrationNumber.toLowerCase() === id.toLowerCase()) ||
        (v.plate_number && v.plate_number.toLowerCase() === id.toLowerCase())
    );

    if (!vehicle) {
      return NextResponse.json(
        {
          success: false,
          error: `Vehicle with ID or registration '${id}' not found.`,
        },
        { status: 404 }
      );
    }

    const allTrips = getMockTrips();
    const vehicleTrips = allTrips
      .filter((t) => String(t.vehicleId) === String(vehicle.id))
      .slice(0, 50);

    return NextResponse.json({
      success: true,
      source: "local",
      vehicle,
      trips: vehicleTrips,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteProps) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, status, lat, lng } = body;

    const supabase = getServiceClient();
    if (supabase) {
      const updates: Record<string, any> = {
        location_updated_at: new Date().toISOString(),
      };
      if (name !== undefined) updates.name = name;
      if (status !== undefined) updates.status = status;
      if (lat !== undefined) updates.lat = Number(lat);
      if (lng !== undefined) updates.lng = Number(lng);

      const isNumeric = /^\d+$/.test(id);
      let query = supabase.from("vehicles").update(updates);

      if (isNumeric) {
        query = query.eq("id", parseInt(id, 10));
      } else {
        query = query.eq("plate_number", id);
      }

      const { data, error } = await query.select().single();

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        vehicle: data,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Vehicle updated (mock mode)",
      updatedFields: body,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteProps) {
  try {
    const { id } = await params;
    const supabase = getServiceClient();

    if (supabase) {
      const isNumeric = /^\d+$/.test(id);

      if (isNumeric) {
        const numId = parseInt(id, 10);
        await supabase.from("trips").delete().eq("vehicle_id", numId);
        const { error } = await supabase.from("vehicles").delete().eq("id", numId);
        if (error) throw error;
      } else {
        const { data: v } = await supabase
          .from("vehicles")
          .select("id")
          .eq("plate_number", id)
          .maybeSingle();

        if (v?.id) {
          await supabase.from("trips").delete().eq("vehicle_id", v.id);
          await supabase.from("vehicles").delete().eq("id", v.id);
        }
      }

      return NextResponse.json({
        success: true,
        message: `Vehicle ${id} and associated trips deleted.`,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Vehicle ${id} deleted (mock mode).`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Delete failed" },
      { status: 500 }
    );
  }
}
