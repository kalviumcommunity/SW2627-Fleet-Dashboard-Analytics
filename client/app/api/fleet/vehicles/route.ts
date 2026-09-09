import { NextRequest, NextResponse } from "next/server";
import { getInTouchDevicePositions } from "@/lib/mapmyindia/intouch";
import { getServiceClient } from "@/lib/supabase/service";
import { getMockVehicles, VehicleRecord } from "@/lib/mockData";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const statusParam = searchParams.get("status");
    const searchParam = searchParams.get("search")?.toLowerCase().trim();

    const isAll = limitParam === "all";
    const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);
    const limit = isAll ? 0 : Math.max(1, Math.min(1000, parseInt(limitParam || "50", 10) || 50));

    // 1. Check Supabase
    const supabase = getServiceClient();
    if (supabase) {
      let query = supabase
        .from("vehicles")
        .select("id, name, plate_number, status, lat, lng, location_updated_at, created_at", {
          count: "exact",
        });

      if (statusParam) {
        query = query.eq("status", statusParam);
      }

      if (searchParam) {
        query = query.or(`name.ilike.%${searchParam}%,plate_number.ilike.%${searchParam}%`);
      }

      if (!isAll) {
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.order("id", { ascending: true }).range(from, to);
      } else {
        query = query.order("id", { ascending: true });
      }

      const { data: supabaseVehicles, error, count } = await query;

      if (!error && supabaseVehicles && supabaseVehicles.length > 0) {
        const total = count || supabaseVehicles.length;
        const totalPages = isAll ? 1 : Math.ceil(total / limit);

        const normalized = supabaseVehicles.map((v) => ({
          id: v.id,
          name: v.name,
          registrationNumber: v.plate_number,
          status: v.status,
          lastKnownLocation: {
            lat: v.lat,
            lng: v.lng,
            timestamp: v.location_updated_at || v.created_at,
          },
        }));

        return NextResponse.json({
          success: true,
          source: "supabase",
          pagination: {
            page,
            limit: isAll ? total : limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
          vehicles: normalized,
        });
      }
    }

    // 2. Check live InTouch devices
    const liveDevices = await getInTouchDevicePositions();
    if (Array.isArray(liveDevices) && liveDevices.length > 0) {
      return NextResponse.json({
        success: true,
        source: "intouch",
        pagination: {
          page: 1,
          limit: liveDevices.length,
          total: liveDevices.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
        vehicles: liveDevices,
      });
    }

    // 3. Fallback: Mock Data
    let allMock = getMockVehicles();

    if (statusParam) {
      allMock = allMock.filter(
        (v) => (v.status || "").toLowerCase() === statusParam.toLowerCase()
      );
    }

    if (searchParam) {
      allMock = allMock.filter((v) => {
        const nameMatch = (v.name || "").toLowerCase().includes(searchParam);
        const regMatch = (v.registrationNumber || v.plate_number || "")
          .toLowerCase()
          .includes(searchParam);
        return nameMatch || regMatch;
      });
    }

    const total = allMock.length;
    const totalPages = isAll ? 1 : Math.ceil(total / limit);

    let paginated = allMock;
    if (!isAll) {
      const start = (page - 1) * limit;
      paginated = allMock.slice(start, start + limit);
    }

    return NextResponse.json({
      success: true,
      source: "local",
      pagination: {
        page,
        limit: isAll ? total : limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      vehicles: paginated,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to fetch fleet vehicles",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, registrationNumber, plate_number, status, lat, lng } = body;

    const plate = registrationNumber || plate_number;

    if (!name || !plate) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: 'name' and 'registrationNumber' (or 'plate_number').",
        },
        { status: 400 }
      );
    }

    const vehicleStatus = status || "idle";
    const now = new Date().toISOString();

    const supabase = getServiceClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("vehicles")
        .insert({
          name,
          plate_number: plate,
          status: vehicleStatus,
          lat: lat !== undefined ? Number(lat) : null,
          lng: lng !== undefined ? Number(lng) : null,
          location_updated_at: now,
          created_at: now,
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          {
            success: false,
            error: `Failed to insert vehicle: ${error.message}`,
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          source: "supabase",
          vehicle: {
            id: data.id,
            name: data.name,
            registrationNumber: data.plate_number,
            status: data.status,
            lastKnownLocation: {
              lat: data.lat,
              lng: data.lng,
              timestamp: data.location_updated_at,
            },
          },
        },
        { status: 201 }
      );
    }

    // If Supabase not connected, return mock success response
    return NextResponse.json(
      {
        success: true,
        source: "local",
        vehicle: {
          id: `vehicle-${Date.now()}`,
          name,
          registrationNumber: plate,
          status: vehicleStatus,
          lastKnownLocation: {
            lat: lat ? Number(lat) : 26.9124,
            lng: lng ? Number(lng) : 75.7873,
            timestamp: now,
          },
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal server error creating vehicle",
      },
      { status: 500 }
    );
  }
}
