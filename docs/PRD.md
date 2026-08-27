# Product Requirements Document (PRD)

## Fleet Dashboard — SW2627 Data Product Development & Delivery Analytics

**Project Admin:** Shyam  
**Team Members:** Aryan, Praveen  
**Date Updated:** August 26, 2026  
**Status:** In Progress — Phase 2 / Implementation  

---

## 1. Problem Statement

Fleet operators managing large numbers of vehicles (scale of 10,000+ vehicles) need a unified, high-performance dashboard to:

- Browse all vehicles in their fleet without browser freezing or memory exhaustion
- View each vehicle's last known GPS location on interactive maps
- Review detailed vehicle trip histories, metrics (distance, timestamps, routes), and status indicators

Existing fleet dashboards often degrade when dealing with thousands of records or make transitioning between high-level fleet overviews and granular trip records slow. This project solves this challenge through static generation, client-side pagination / infinite scroll, modern map SDK integration, and an efficient database backend.

---

## 2. Target Users

- **Fleet Managers / Dispatchers**: Need to monitor vehicle status (active, idle, offline) and inspect last known coordinates in real time.
- **Operations & Audit Teams**: Need to review historical trips, distance logs, and route summaries for compliance and reporting.
- **System Administrators**: Manage platform access, user credentials, and role-based permissions.

---

## 3. Goals

- Allow authenticated users to smoothly browse a fleet directory of 10,000+ vehicles.
- Enable map-based visualization of last known vehicle locations via Mappls (MapmyIndia) SDK.
- Allow fast navigation into per-vehicle trip histories without UI lag.
- Provide secure user authentication and role-based access control (Admin / User) backed by PostgreSQL & Prisma ORM.
- Containerize the entire application using Docker for consistent local and cloud deployments.

---

## 4. Core Features (Must-Have)

| Feature | Description | Status |
|---|---|---|
| **User Authentication & RBAC** | User registration and login backed by PostgreSQL, Prisma ORM, and Auth.js with role separation (`ADMIN`, `USER`). | In Progress |
| **Fleet Directory (Vehicle List)** | Displays 10,000 fleet vehicles with status badges, registration numbers, and unique identifiers. | Implemented |
| **Vehicle Detail & Trip History** | Dedicated route (`/dashboard/[vehicleId]`) rendering vehicle metadata, GPS coordinates, and historical trip logs. | Implemented |
| **Map Visualization** | Mappls (MapmyIndia) vector map integration to render interactive markers for vehicle coordinates. | POC Implemented (`/map-test`) |
| **High-Scale Mock Data Generator** | Automated dataset generation engine (`generateMockData.ts`) synthesizing 10,000 vehicles and 50,000 trips. | Implemented |
| **Infinite Scroll & Pagination** | Client-side chunking/pagination to ensure smooth scrolling without loading 10k items into the DOM simultaneously. | In Progress |
| **Containerized Deployment** | Dockerfile and Docker Compose configuration for cross-platform execution. | Implemented |

---

## 5. Nice-to-Have (Future Sprints)

- Live GPS socket stream for real-time moving markers.
- Advanced vehicle filtering (by status, geofence zone, driver).
- CSV/PDF trip history export.
- Fleet health diagnostics and maintenance alerts.
- Multi-organization tenant isolation.

---

## 6. Success Criteria

- Fleet dashboard directory renders without browser stuttering when handling a 10,000-vehicle dataset.
- Vehicle detail page loads within < 1.5 seconds with full trip history.
- Map correctly initializes and positions markers on valid coordinates.
- PostgreSQL database stores user profiles securely with hashed passwords and distinct roles.
- Docker containers build and launch successfully using `docker-compose up --build`.

---

## 7. Assumptions & Technical Decisions

- **Frontend Framework:** Next.js 16 (App Router) with React 19 and Tailwind CSS v4.
- **Data Source:** High-volume synthetic mock dataset generated via TypeScript script (`tsx scripts/generateMockData.ts`) generating 10,000 vehicles and 50,000 trips clustered around realistic coordinates.
- **Database & User Store:** PostgreSQL database configured with Prisma ORM for relational queries, user schemas, and RBAC support.
- **Map SDK:** Mappls (MapmyIndia) Vector Maps SDK v3.0 (`mappls-web-maps`).
- **Containerization:** Node.js 20 Alpine multi-stage Docker build.

---

## 8. Open Questions & Resolutions

- ~~What is the actual data source for vehicles and trips?~~  
  **Resolved:** Synthesized 10,000 vehicles and 50,000 trips using `client/scripts/generateMockData.ts`, persisted in `client/mock/*.json` for scalable frontend testing.
- ~~How is user authentication and session management stored?~~  
  **Resolved:** Structured User model in PostgreSQL managed by Prisma ORM (`client/prisma/schema.prisma`), supporting role-based access control.
- ~~How are maps integrated for Indian geocoordinates?~~  
  **Resolved:** Mappls Web Maps SDK (`mappls-web-maps`) with API credentials, verified via `/map-test`.

---

## 9. Project Timeline

| Milestone | Phase | Description | Status |
|---|---|---|---|
| **Phase 1** | Planning & PRD | Problem statement, team alignment, PRD & TRD drafts | Completed |
| **Phase 2** | UI/UX & Architecture | Layouts, Mock Data Engine, Prisma Schema, Docker setup | Completed / In Progress |
| **Phase 3** | Integration & Map Rendering | Full Mappls integration on vehicle detail views, auth enforcement | Active |
| **Phase 4** | Optimization & Review | Infinite scrolling at 10k scale, load testing, final deployment | Upcoming |

---

## 10. Related Documents

- [Technical Requirements Document (TRD)](./TRD.md)
- [UI/UX Design Document](./UIUX.md)
- [Project Readme](../readme.md)
- [Client Readme](../client/README.md)
