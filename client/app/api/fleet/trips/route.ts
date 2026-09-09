import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/service";
import { getMockTrips, TripRecord } from "@/lib/mockData";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get("vehicleId");
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);
    const limit = Math.max(1, Math.min(200, parseInt(limitParam || "20", 10) || 20));

    // 1. Check Supabase
    const supabase = getServiceClient();
    if (supabase) {
      let query = supabase.from("trips").select("*", { count: "exact" });

      if (vehicleId) {
        const isNum = /^\d+$/.test(vehicleId);
        if (isNum) {
          query = query.eq("vehicle_id", parseInt(vehicleId, 10));
        }
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.order("start_time", { ascending: false }).range(from, to);

      const { data, count, error } = await query;

      if (!error && data && data.length > 0) {
        const total = count || data.length;
        const totalPages = Math.ceil(total / limit);

        const normalized = data.map((t) => ({
          id: t.id,
          vehicleId: t.vehicle_id,
          startTime: t.start_time,
          endTime: t.end_time,
          distanceKm: t.distance,
          startLocation: { lat: t.start_lat, lng: t.start_lng },
          endLocation: { lat: t.end_lat, lng: t.end_lng },
          status: t.status,
          createdAt: t.created_at,
        }));

        return NextResponse.json({
          success: true,
          source: "supabase",
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
          trips: normalized,
        });
      }
    }

    // 2. Fallback: Mock Trips
    let allMock = getMockTrips();

    if (vehicleId) {
      allMock = allMock.filter(
        (t) =>
          String(t.vehicleId).toLowerCase() === vehicleId.toLowerCase() ||
          String(t.vehicle_id).toLowerCase() === vehicleId.toLowerCase()
      );
    }

    const total = allMock.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginated = allMock.slice(start, start + limit);

    return NextResponse.json({
      success: true,
      source: "local",
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      trips: paginated,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to fetch fleet trips",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      vehicleId,
      vehicle_id,
      startTime,
      start_time,
      endTime,
      end_time,
      startLat,
      startLng,
      endLat,
      endLng,
      distanceKm,
      distance,
    } = body;

    const vId = vehicleId || vehicle_id;
    if (!vId) {
      return NextResponse.json(
        { success: false, error: "Missing required field: 'vehicleId'." },
        { status: 400 }
      );
    }

    const startT = startTime || start_time || new Date().toISOString();
    const endT = endTime || end_time || new Date().toISOString();
    const dist = distanceKm !== undefined ? Number(distanceKm) : Number(distance || 0);

    const supabase = getServiceClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("trips")
        .insert({
          vehicle_id: Number(vId),
          start_time: startT,
          end_time: endT,
          start_lat: startLat !== undefined ? Number(startLat) : null,
          start_lng: startLng !== undefined ? Number(startLng) : null,
          end_lat: endLat !== undefined ? Number(endLat) : null,
          end_lng: endLng !== undefined ? Number(endLng) : null,
          distance: dist,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          source: "supabase",
          trip: data,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        source: "local",
        trip: {
          id: `trip-${Date.now()}`,
          vehicleId: vId,
          startTime: startT,
          endTime: endT,
          distanceKm: dist,
          startLocation: { lat: startLat || 26.9124, lng: startLng || 75.7873 },
          endLocation: { lat: endLat || 27.0124, lng: endLng || 75.8873 },
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal error recording trip",
      },
      { status: 500 }
    );
  }
}
