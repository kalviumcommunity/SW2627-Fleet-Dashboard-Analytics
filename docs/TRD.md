# Technical Requirements Document (TRD)
## Fleet Dashboard — SW2627 Data Product Development & Delivery Analytics

**Project Admin:** Shyam
**Team Members:** Aryan, Praveen
**Date:** August 20, 2026
**Status:** Draft — Week 1

---

## 1. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend Framework | Next.js | Native support for static generation (SSG), needed for fast load with 10,000 vehicles |
| Authentication | Auth.js (NextAuth) | Structured auth with OAuth support, session/role handling, route protection |
| Map SDK | MapmyIndia | Required for displaying last known vehicle locations |
| Data Fetching | [To be decided — real API / mock JSON] | Pending confirmation of data source |
| Styling | [To be decided in Week 2 design phase] | — |
| Hosting/Deployment | [To be decided — e.g., Vercel] | — |

---

## 2. Architecture Overview

- **Vehicle List Page** — statically generated (SSG) at build time or via Incremental Static Regeneration (ISR) if vehicle data changes periodically. This avoids re-fetching/re-rendering 10,000 records on every request.
- **Trip History** — fetched per vehicle, paginated, loaded via infinite scroll (client-side fetching as user scrolls, not part of static generation since trip data is larger and more dynamic).
- **Map View** — renders last known location per vehicle using MapmyIndia SDK; marker data can be static-generated alongside the vehicle list or fetched on vehicle selection.
- **Auth Layer** — Auth.js sits at the route/middleware level, protecting all `/dashboard/*` routes. Server actions/API routes independently re-check session + role before returning or mutating data.

---

## 3. Authentication & Authorization

**Provider Strategy:** OAuth (e.g., Google or GitHub) for Week 3 build — avoids handling password storage ourselves.

**Session Data:** Keep minimal — user id, email, name, role. No sensitive data in the session payload.

**Session Storage:** JWT-based sessions (avoids DB lookup per request, suitable for our timeline/scale).

**Roles (RBAC):**
| Role | Access |
|---|---|
| Admin | Full access — view all vehicles, trip history, map; manage users (future scope) |
| Viewer | View-only access — vehicle list, trip history, map |

**Protection Layers:**
1. Middleware — redirects unauthenticated users away from `/dashboard` routes
2. Server-side checks — every API route/server action re-validates session + role before returning/writing data (UI hiding alone is not sufficient)

**Secrets:** Auth secret, OAuth client secret, database URL (if used), MapmyIndia API Key, Client ID, and Client Secret stored in environment variables only — never in client-side code.

---

## 4. Data Model

### Vehicle
```
{
  id: string,
  name: string,
  registrationNumber: string,
  status: "active" | "idle" | "offline",
  lastKnownLocation: {
    lat: number,
    lng: number,
    timestamp: string
  }
}
```

### Trip
```
{
  id: string,
  vehicleId: string,
  startTime: string,
  endTime: string,
  startLocation: { lat: number, lng: number },
  endLocation: { lat: number, lng: number },
  distanceKm: number
}
```

*(Fields to be refined once real data source is confirmed.)*

---

## 5. Data Source Strategy

- **Option A:** Real API (if MapmyIndia or another provider exposes vehicle/trip data)
- **Option B:** Mock data — generate 10,000 fake vehicles + trip records (e.g., via a script) to simulate scale for testing static generation and infinite scroll performance

**Decision:** [Pending — to be finalized after today's team research sync]

---

## 6. Performance Considerations

- Vehicle list uses SSG/ISR so the page doesn't regenerate on every request for all 10,000 vehicles
- Infinite scroll on both vehicle list (if paginated further) and trip history to avoid loading everything at once
- Map should avoid rendering 10,000 markers simultaneously without clustering — investigate marker clustering support in MapmyIndia SDK
- Consider lightweight vehicle list payload (avoid sending full trip history in the initial list fetch)

---

## 7. Open Technical Questions

- Confirm data source (real API vs mock) — impacts how static generation is implemented (build-time vs ISR)
- Does MapmyIndia SDK support marker clustering for large datasets?
- What's our approach to testing at 10,000-vehicle scale (seed script, load testing tool)?

---

## 8. Related Documents

- Product Requirements Document (PRD)
- UI/UX Design Docs