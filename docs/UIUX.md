# UI/UX Design Document
## Fleet Dashboard — SW2627 Data Product Development & Delivery Analytics

**Project Admin:** Shyam
**Team Members:** Aryan, Pranav
**Date:** August 20, 2026
**Status:** Draft — to be completed in Week 2

---

## 1. Purpose

Define the user flows, screens, and visual/interaction patterns for the Fleet Dashboard before development begins in Week 3.

---

## 2. User Flow

1. User lands on **Login page** → signs in via OAuth
2. On success, redirected to **Dashboard (Vehicle List)**
3. User scrolls through vehicle list (infinite scroll)
4. User selects a vehicle → navigates to **Vehicle Detail** view
5. Vehicle Detail view shows:
   - **Trip History** (infinite scroll)
   - **Map** with last known location marker
6. User can navigate back to the vehicle list at any point

---

## 3. Screens to Design

### 3.1 Login Page
- OAuth sign-in button(s)
- Minimal branding, no sensitive info exposed pre-login

### 3.2 Vehicle List (Dashboard Home)
- Table or card-based list of vehicles
- Key fields shown: vehicle name/ID, registration number, status (active/idle/offline), last updated time
- Infinite scroll loading indicator
- Empty/loading/error states

### 3.3 Vehicle Detail Page
- Header: vehicle name, registration, status
- Map section: last known location marker
- Trip history section: list of trips (date, start/end location, distance), infinite scroll
- Empty state: "No trips recorded yet"

### 3.4 Map View (component, embedded in Vehicle Detail; optionally also a full fleet map)
- Marker for last known location
- Marker clustering if showing multiple vehicles at once (full fleet map, if included)
- Popup/info card on marker click: vehicle name, last updated time

---

## 4. Design System Basics (to define in Week 2)

- **Color palette:** [TBD]
- **Typography:** [TBD]
- **Spacing/grid system:** [TBD]
- **Component library approach:** [TBD — custom components vs UI library]

---

## 5. Key Interaction Patterns

- **Infinite scroll:** Loading skeleton/spinner at list bottom; avoid layout shift when new items load
- **Status indicators:** Color-coded badges for vehicle status (e.g., green = active, gray = idle, red = offline)
- **Map interaction:** Click marker to view quick info; link to full vehicle detail page
- **Navigation:** Persistent way to return to vehicle list from detail view (breadcrumb or back button)

---

## 6. Responsive Considerations

- Dashboard should be usable on both desktop (primary) and tablet
- Map and trip history should stack vertically on smaller screens rather than side-by-side

---

## 7. Accessibility Notes

- Sufficient color contrast for status indicators (don't rely on color alone — use icons/labels too)
- Keyboard navigability for vehicle list and detail views
- Alt text/labels for map markers where feasible

---

## 8. Open Design Questions

- Table view or card view for the vehicle list — which scales/reads better with 10,000 entries?
- Should there be a full fleet map view (all vehicles at once) in addition to per-vehicle maps?
- What roles (Admin vs Viewer) see different UI, if any?

---

## 9. Related Documents

- Product Requirements Document (PRD)
- Technical Requirements Document (TRD)