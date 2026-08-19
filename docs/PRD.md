# Product Requirements Document (PRD)
## Fleet Dashboard — SW2627 Data Product Development & Delivery Analytics

**Team:** S124-Team04
**Project Admin:** Shyam Sharma
**Team Members:** Aryan Rustagi, Parveen Dhaka
**Date:** August 19, 2026
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

---

## 3. Goals

- Allow users to browse a list of all vehicles in the fleet
- Allow users to view a vehicle's last known location on a map
- Allow users to scroll through a vehicle's trip history without performance issues
- Ensure the dashboard loads quickly even with 10,000 vehicles

---

## 4. Core Features (Must-Have)

| Feature | Description |
|---|---|
| Vehicle List | Displays all vehicles, statically generated for fast load at scale |
| Infinite Scroll — Vehicle List | List loads more vehicles as the user scrolls, instead of loading all 10,000 at once |
| Trip History | Per-vehicle list of past trips |
| Infinite Scroll — Trip History | Trip history loads more entries as the user scrolls |
| Map View | Displays each vehicle's last known location as a marker |
| Vehicle Detail Link | Selecting a vehicle from the list shows its trip history and location |

---

## 5. Nice-to-Have (Out of Scope for This Sprint, Consider Later)

- Real-time location updates (live tracking vs last known location)
- Search/filter vehicles by status, driver, or region
- Exporting trip history as CSV/PDF
- Notifications/alerts (e.g., idle vehicle, geofence breach)

---

## 6. Success Criteria

- Vehicle list page loads quickly even when simulating 10,000 vehicles (via static generation)
- Infinite scroll works smoothly on both vehicle list and trip history without noticeable lag
- Map correctly displays last known location for a selected vehicle
- Dashboard works end-to-end: list → select vehicle → view trip history + map location

---

## 7. Assumptions

- Vehicle and trip data will be sourced from [a real API / mock data — to be decided in TRD]
- "Last known location" refers to the most recent recorded GPS point per vehicle, not live tracking
- Map integration will use [MapmyIndia SDK / alternative — to be confirmed in TRD]

---

## 8. Open Questions

- What is the actual data source for vehicles and trips — live API, provided dataset, or do we need to generate mock data?
- How frequently should "last known location" be considered outdated/stale?
- Do we need authentication/login, or is this a single-fleet, no-login dashboard for this sprint?

---

## 9. Timeline

| Week | Phase |
|---|---|
| Week 1 | Planning & PRD |
| Week 2 | Design (wireframes + UI) |
| Week 3–5 | Development & Deployment |

---

## 10. Related Documents

- Technical Requirements Document (TRD) — [link once created]
- UI/UX Design Docs — [link once created]