# Fleet Dashboard

A fleet management dashboard that lets users view all vehicles in a fleet, see each vehicle's last known location on a map, and browse per-vehicle trip history — built to stay fast even at a scale of 10,000 vehicles.

Built as part of **SW2627 — Data Product Development & Delivery Analytics** (Kalvium Community).

---

## Team — Team 04

| Name | Role |
|---|---|
| Shyam | Project Admin — Auth (Login/Signup) |
| Aryan | Team Member — Map Integration (Mappls) |
| Parveen | Team Member — Backend & Database (Supabase) |

**Mentor:** Manav

---

## Problem Statement

Fleet operators managing large fleets need a single dashboard to monitor vehicle locations and review trip history. Most existing tools struggle to stay fast at scale or make it hard to move between a vehicle list and its detailed trip/location data. This project solves that by combining a statically generated vehicle list with an infinite-scroll trip history and map view.

---

## Features

- **Authentication** — sign up/sign in via Supabase Auth, with protected `/dashboard` routes
- **Vehicle List** — statically generated so the dashboard loads quickly even with 10,000 vehicles
- **Infinite Scroll** — for both the vehicle list and trip history, avoiding loading everything at once
- **Vehicle Detail Page** — shows vehicle info and full trip history per vehicle
- **Map View** — displays each vehicle's last known location using the Mappls (MapmyIndia) SDK
- **Role-Based Access** — Admin and Viewer roles control what a user can see/do

---

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS Modules |
| Authentication & Database | Supabase (Auth + Postgres) |
| Map Integration | Mappls (MapmyIndia) SDK |
| Containerization (local dev) | Docker + Docker Compose |
| Mock Data | Custom generator script (scalable to 10,000 vehicles / 50,000 trips) |

---

## Project Structure

```
client/
├── app/
│   ├── login/            # Login page + styles
│   ├── signup/           # Signup page + styles
│   └── dashboard/
│       ├── page.tsx      # Vehicle list (static generation)
│       └── [vehicleId]/  # Vehicle detail + trip history
├── lib/
│   └── supabase/         # Supabase client (browser + server)
├── components/           # Shared UI components (e.g. MapView)
├── mock/                 # Generated mock vehicles.json / trips.json
├── scripts/               # Mock data generator, seed scripts
├── docs/                  # PRD, TRD, UI/UX documents
├── middleware.ts          # Route protection for /dashboard
├── docker-compose.yml
├── Dockerfile
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm
- A Supabase account/project (for auth + database)
- A Mappls (MapmyIndia) developer account (for the map SDK key)
- Docker (optional, for local Postgres testing)

### Setup

```bash
# Clone the repository
git clone https://github.com/KalviumCommunity/SW2627-Fleet-Dashboard-Analytics.git

# Move into the client app
cd SW2627-Fleet-Dashboard-Analytics/client

# Install dependencies
npm install

# Run the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables

Create a `.env.local` file inside `/client`:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Mappls (MapmyIndia)
NEXT_PUBLIC_MAPMYINDIA_API_KEY=your-mappls-map-sdk-key

# Optional — only needed if testing with local Docker Postgres via Prisma
DATABASE_URL=postgresql://fleetuser:fleetpass@localhost:5432/fleetdb
```

> Never commit `.env.local` or any real keys to the repository. The Supabase `service_role` key is never used client-side — it stays private and is only used in trusted server-side scripts (e.g. seeding).

---

## Mock Data (Local Testing)

To generate mock vehicle and trip data for local testing at scale:

```bash
npm run generate:mock
```

Edit `VEHICLE_COUNT` in `scripts/generateMockData.ts` to test at different scales (default: 100, tested up to 10,000).

---

## Documentation

Detailed project documentation is available in the `/docs` folder:
- **PRD.md** — Product Requirements Document
- **TRD.md** — Technical Requirements Document
- **UIUX.md** — UI/UX Design Document

---

## Project Timeline

| Phase | Focus |
|---|---|
| Week 1 | Planning & PRD |
| Week 2 | Design |
| Weeks 3–5 | Development, testing & deployment |

**Target completion:** September 20, 2026

---

## Contributing (Team Workflow)

- `main` is protected — no direct pushes
- Create a feature branch for any change: `git checkout -b feature/your-feature-name`
- Open a pull request into `main` and get at least one review before merging
