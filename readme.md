# Fleet Dashboard

A fleet management dashboard that lets users view all vehicles in a fleet, see each vehicle's last known location on a map, and browse per-vehicle trip history — built to stay fast even at a scale of 10,000 vehicles.

Built as part of **SW2627 — Data Product Development & Delivery Analytics** (Kalvium Community).

---

## Team — Team 04

| Name | Role |
|---|---|
| Shyam | Project Admin |
| Aryan | Team Member |
| Parveen | Team Member |

---

## Problem Statement

Fleet operators managing large fleets need a single dashboard to monitor vehicle locations and review trip history. Most existing tools struggle to stay fast at scale or make it hard to move between a vehicle list and its detailed trip/location data. This project solves that by combining a statically generated vehicle list with an infinite-scroll trip history and map view.

---

## Features

- **Vehicle List** — statically generated so the dashboard loads quickly even with 10,000 vehicles
- **Infinite Scroll** — for both the vehicle list and trip history, avoiding loading everything at once
- **Map View** — displays each vehicle's last known location using the MapmyIndia SDK
- **Authentication** — sign-in via Auth.js (NextAuth) with OAuth
- **Role-Based Access** — Admin and Viewer roles control what a user can see/do

---

## Tech Stack

- **Frontend:** Next.js
- **Authentication:** Auth.js (NextAuth)
- **Map Integration:** MapmyIndia SDK
- **Data:** [Real API / Mock data — update once finalized]

---

## Project Structure

```
├── client/     # Next.js application (frontend + API routes)
├── docs/       # PRD, TRD, and UI/UX design documents
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or later recommended)
- npm or yarn

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

Create a `.env.local` file inside `/client` with the following (values to be filled in by the team):

```
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
MAPMYINDIA_API_KEY=
```

> Never commit `.env.local` or any secrets to the repository.

---

## Documentation

Detailed project documentation is available in the `/docs` folder:
- **PRD.md** — Product Requirements Document
- **TRD.md** — Technical Requirements Document
- **UIUX.md** — UI/UX Design Document

---

## Project Timeline

| Week | Phase |
|---|---|
| Week 1 | Planning & PRD |
| Week 2 | Design |
| Week 3–5 | Development & Deployment |

---

## Contributing (Team Workflow)

- `main` is protected — no direct pushes
- Create a feature branch for any change: `git checkout -b feature/your-feature-name`
- Open a pull request into `main` and get at least one review before merging