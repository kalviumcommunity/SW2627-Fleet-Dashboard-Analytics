import fs from "fs";
import path from "path";

type VehicleStatus = "active" | "idle" | "offline";

interface Location {
  lat: number;
  lng: number;
  timestamp?: string;
}

interface Vehicle {
  id: string;
  name: string;
  registrationNumber: string;
  status: VehicleStatus;
  lastKnownLocation: Location;
}

interface Trip {
  id: string;
  vehicleId: string;
  startTime: string;
  endTime: string;
  startLocation: {
    lat: number;
    lng: number;
  };
  endLocation: {
    lat: number;
    lng: number;
  };
  distanceKm: number;
}

// Keep mock data small enough for local development and builds.
// Larger values can make the app exhaust memory when importing JSON files.
const VEHICLE_COUNT = 100;

// Number of trips generated for each vehicle.
const TRIPS_PER_VEHICLE = 3;

// Jaipur/Rajasthan approximate coordinates.
// Used as the center for generating realistic mock locations.
const BASE_LATITUDE = 26.9124;
const BASE_LONGITUDE = 75.7873;

// Generate a random number between min and max.
function randomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// Generate a random vehicle status.
function generateStatus(): VehicleStatus {
  const statuses: VehicleStatus[] = ["active", "idle", "offline"];

  return statuses[Math.floor(Math.random() * statuses.length)];
}

// Generate a location around Jaipur.
function generateLocation(): {
  lat: number;
  lng: number;
} {
  return {
    lat: Number(
      randomNumber(
        BASE_LATITUDE - 0.5,
        BASE_LATITUDE + 0.5
      ).toFixed(6)
    ),

    lng: Number(
      randomNumber(
        BASE_LONGITUDE - 0.5,
        BASE_LONGITUDE + 0.5
      ).toFixed(6)
    ),
  };
}

// Generate a random date within the last 30 days.
function generateDate(daysAgo = 30): Date {
  const now = new Date();

  const millisecondsAgo =
    Math.random() *
    daysAgo *
    24 *
    60 *
    60 *
    1000;

  return new Date(now.getTime() - millisecondsAgo);
}

// Generate a vehicle.
function generateVehicle(index: number): Vehicle {
  const location = generateLocation();

  return {
    id: `vehicle-${String(index).padStart(5, "0")}`,

    name: `Vehicle ${index}`,

    registrationNumber: `RJ14${String(
      1000 + index
    ).slice(-4)}`,

    status: generateStatus(),

    lastKnownLocation: {
      lat: location.lat,
      lng: location.lng,
      timestamp: new Date().toISOString(),
    },
  };
}

// Generate trips for a vehicle.
function generateTrips(
  vehicle: Vehicle,
  startIndex: number
): Trip[] {
  const trips: Trip[] = [];

  for (let i = 0; i < TRIPS_PER_VEHICLE; i++) {
    const startLocation = generateLocation();
    const endLocation = generateLocation();

    const startTime = generateDate(30);

    // Trip duration between 30 minutes and 5 hours.
    const durationMinutes = Math.floor(
      randomNumber(30, 300)
    );

    const endTime = new Date(
      startTime.getTime() +
        durationMinutes * 60 * 1000
    );

    const distanceKm = Number(
      randomNumber(5, 500).toFixed(2)
    );

    trips.push({
      id: `trip-${String(
        startIndex + i
      ).padStart(6, "0")}`,

      vehicleId: vehicle.id,

      startTime: startTime.toISOString(),

      endTime: endTime.toISOString(),

      startLocation: {
        lat: startLocation.lat,
        lng: startLocation.lng,
      },

      endLocation: {
        lat: endLocation.lat,
        lng: endLocation.lng,
      },

      distanceKm,
    });
  }

  return trips;
}

// Generate all vehicles and trips.
function generateMockData() {
  const vehicles: Vehicle[] = [];
  const trips: Trip[] = [];

  let tripIndex = 1;

  for (let i = 1; i <= VEHICLE_COUNT; i++) {
    const vehicle = generateVehicle(i);

    vehicles.push(vehicle);

    const vehicleTrips = generateTrips(
      vehicle,
      tripIndex
    );

    trips.push(...vehicleTrips);

    tripIndex += TRIPS_PER_VEHICLE;
  }

  return {
    vehicles,
    trips,
  };
}

// Generate the data.
const { vehicles, trips } = generateMockData();

// Create the mock directory.
const outputDirectory = path.join(
  process.cwd(),
  "mock"
);

if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory, {
    recursive: true,
  });
}

// Output paths.
const vehiclesPath = path.join(
  outputDirectory,
  "vehicles.json"
);

const tripsPath = path.join(
  outputDirectory,
  "trips.json"
);

// Write JSON files.
fs.writeFileSync(
  vehiclesPath,
  JSON.stringify(vehicles, null, 2)
);

fs.writeFileSync(
  tripsPath,
  JSON.stringify(trips, null, 2)
);

console.log(
  `Generated ${vehicles.length} vehicles.`
);

console.log(
  `Generated ${trips.length} trips.`
);

console.log(
  `Vehicles saved to: ${vehiclesPath}`
);

console.log(
  `Trips saved to: ${tripsPath}`
);