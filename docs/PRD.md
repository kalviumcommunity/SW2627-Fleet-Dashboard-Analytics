# Product Requirements Document (PRD)
## Fleet Dashboard — SW2627 Data Product Development & Delivery Analytics

**Project Admin:** Shyam
**Team Members:** Aryan, Pranav
**Date Updated:** August 20, 2026
**Status:** Draft — Week 1

---

## 1. Problem Statement

Fleet operators managing large numbers of vehicles (up to 10,000) need a single dashboard to:
- View all vehicles in their fleet
- See each vehicle's last known location on a map
- Review a vehicle's trip history

Existing tools either don't scale well to large fleets or make it hard to quickly move between a vehicle list and its trip/location details. This project aims to build a fast, scalable fleet dashboard that solves this.

---

## 2. Target User

- Fleet managers / dispatchers who need to monitor vehicle locations and trip activity
- Operations teams who need to review historical trips for reporting or auditing
- Admin users who manage access and permissions for the dashboard

---

## 3. Goals

- Allow authenticated users to browse a list of all vehicles in the fleet
- Allow users to view a vehicle's last known location on a map
- Allow users to scroll through a vehicle's trip history without performance issues
- Ensure the dashboard loads quickly even with 10,000 vehicles
- Ensure only authorized users can access fleet data (role-based access)

---

## 4. Core Features (Must-Have)

| Feature | Description |
|---|---|
| Authentication | Users sign in via OAuth before accessing the dashboard |
| Role-Based Access | Roles (e.g., Admin, Viewer) determine what a user can see/do |
| Vehicle List | Displays all vehicles, statically generated for fast load at scale |
| Infinite Scroll — Vehicle List | List loads more vehicles as the user scrolls, instead of loading all 10,000 at once |
| Trip History | Per-vehicle list of past trips |
| Infinite Scroll — Trip History | Trip history loads more entries as the user scrolls |
| Map View | Displays each vehicle's last known location as a marker |
| Vehicle Detail Link | Selecting a vehicle from the list shows its trip history and location |
| Protected Routes | Dashboard pages are inaccessible without a valid session |

---

## 5. Nice-to-Have (Out of Scope for This Sprint)

- Real-time location updates (live tracking vs last known location)
- Search/filter vehicles by status, driver, or region
- Exporting trip history as CSV/PDF
- Notifications/alerts (e.g., idle vehicle, geofence breach)
- Multiple organizations/multi-tenant support

---

## 6. Success Criteria

- Vehicle list page loads quickly even when simulating 10,000 vehicles (via static generation)
- Infinite scroll works smoothly on both vehicle list and trip history without noticeable lag
- Map correctly displays last known location for a selected vehicle
- Unauthenticated users cannot access `/dashboard` or any protected route
- Only users with the correct role can access admin-level actions
- Dashboard works end-to-end: login → vehicle list → select vehicle → view trip history + map location

---

## 7. Assumptions

- Frontend framework: **Next.js** (chosen to support static generation and pair with Auth.js)
- Authentication: **Auth.js (NextAuth)** with one OAuth provider (e.g., Google or GitHub) for Week 3 build
- "Last known location" refers to the most recent recorded GPS point per vehicle, not live tracking
- Map integration will use the **MapmyIndia SDK**
- Vehicle and trip data source (real API vs mock data) — to be finalized in TRD

---

## 8. Open Questions

- ~~Do we need authentication/login?~~ **Resolved:** Yes — using Auth.js with OAuth and role-based access
- What is the actual data source for vehicles and trips — live API, provided dataset, or mock data?
- How frequently should "last known location" be considered outdated/stale?
- What roles do we need beyond Admin/Viewer (e.g., Dispatcher)?

---

## 9. Timeline

| Week | Phase |
|---|---|
| Week 1 | Planning & PRD |
| Week 2 | Design (wireframes + UI) |
| Week 3–5 | Development & Deployment |

---

## 10. Related Documents

- Technical Requirements Document (TRD)
- UI/UX Design Docs