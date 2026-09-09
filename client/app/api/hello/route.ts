import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    name: "SW2627 Fleet Dashboard Analytics API",
    version: "1.0.0",
    status: "operational",
    endpoints: {
      health: {
        path: "/api/health",
        method: "GET",
        description: "Service health check and uptime monitor for Render.",
      },
      fleetVehicles: {
        path: "/api/fleet/vehicles",
        methods: ["GET", "POST"],
        description:
          "List fleet vehicles with pagination (?page=1&limit=50), status filter (?status=active), and search (?search=DL01). POST to register a new vehicle.",
      },
      singleVehicle: {
        path: "/api/fleet/vehicles/[id]",
        methods: ["GET", "PATCH", "DELETE"],
        description:
          "Fetch single vehicle details with trip logs, update vehicle coordinates/status, or delete vehicle.",
      },
      trips: {
        path: "/api/fleet/trips",
        methods: ["GET", "POST"],
        description:
          "Fetch trip logs (?vehicleId=...&page=1&limit=20) or log a completed trip.",
      },
      stats: {
        path: "/api/fleet/stats",
        method: "GET",
        description:
          "Aggregate metrics: total vehicles, active, idle, offline counts, and total trips.",
      },
      mapplsToken: {
        path: "/api/mappls/token",
        method: "GET",
        description: "Generate Mappls OAuth access token or retrieve SDK key configuration.",
      },
    },
  });
}