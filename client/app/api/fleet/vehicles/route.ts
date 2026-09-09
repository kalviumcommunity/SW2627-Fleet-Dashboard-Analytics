import { NextResponse } from "next/server";
import { getInTouchDevicePositions } from "@/lib/mapmyindia/intouch";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const liveDevices = await getInTouchDevicePositions();

    // If live devices exist from InTouch, return them, otherwise return mock fleet
    if (Array.isArray(liveDevices) && liveDevices.length > 0) {
      return NextResponse.json({
        source: "intouch",
        vehicles: liveDevices,
      });
    }

    let mockVehicles = [];
    const directMockPath = path.join(process.cwd(), "mock", "vehicles.json");
    const nestedMockPath = path.join(process.cwd(), "client", "mock", "vehicles.json");
    const resolvedMockPath = fs.existsSync(directMockPath)
      ? directMockPath
      : fs.existsSync(nestedMockPath)
      ? nestedMockPath
      : null;

    if (resolvedMockPath) {
      mockVehicles = JSON.parse(fs.readFileSync(resolvedMockPath, "utf-8"));
    }

    return NextResponse.json({
      source: "local",
      vehicles: mockVehicles,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch fleet vehicles" },
      { status: 500 }
    );
  }
}
