# Fleet Dashboard

A scalable fleet management analytics dashboard designed to monitor and visualize large vehicle fleets (scale of 10,000+ vehicles), inspect real-time/last-known locations via Mappls (MapmyIndia) SDK, and explore per-vehicle trip histories with high performance.

Built as part of **SW2627 — Data Product Development & Delivery Analytics** (Kalvium Community).

---

## Team — Team 04

| Name | Role |
|---|---|
| Shyam | Project Admin |
| Aryan | Team Member |
| Praveen | Team Member |

---

## Problem Statement

Fleet operators managing large-scale fleets need a consolidated and responsive dashboard to monitor vehicle status, inspect last known GPS coordinates on interactive maps, and analyze historical trip data. Traditional tools face latency and rendering bottlenecks at large fleet volumes (10,000+ vehicles). This project delivers high-performance fleet analytics using statically generated datasets, client-side pagination / infinite scroll, interactive vector maps, and role-based access control.

---

## Features

- **High-Scale Vehicle Directory**: Browse 10,000+ fleet vehicles with instant loading, status badges (`active`, `idle`, `offline`), and registration details.
- **Trip History & Analytics**: View per-vehicle historical trips with distance metrics, start/end timestamps, and geocoordinates.
- **Interactive Map Integration**: Integrated with the Mappls (MapmyIndia) Vector Maps SDK for precise location visualization and marker mapping.
- **User Management & Persistence**: PostgreSQL database integration with Prisma ORM for structured user management, credentials, and RBAC (`ADMIN`, `USER`).
- **Mock Data Engine**: Automated dataset generator producing 10,000 vehicles and 50,000 realistic trips centered around regional coordinates.
- **Containerized Deployment**: Full Docker and Docker Compose support for reproducible development and production builds.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16 (App Router) & React 19 | Frontend application, SSG, and server-side logic |
| **Styling** | Tailwind CSS v4 | Responsive, modern utility styling and design tokens |
| **Maps SDK** | Mappls Web Maps SDK (`mappls-web-maps`) | Vector maps, vehicle markers, and geospatial rendering |
| **Database & ORM** | PostgreSQL & Prisma ORM v6 | User schema, persistent account storage, and migrations |
| **Data Engine** | TypeScript Mock Generator (`tsx`) | Generates realistic 10k vehicle dataset and 50k trip logs |
| **Containerization** | Docker & Docker Compose | Containerized runtime and local orchestration |
| **Language** | TypeScript | Full type safety across components, scripts, and schemas |

---

## Project Structure

```
SW2627-Fleet-Dashboard-Analytics/
├── Dockerfile                # Production Docker container definition (Node 20 Alpine)
├── docker-compose.yml        # Docker Compose configuration for local/containerized runs
├── docs/                     # Project planning and architecture specifications
│   ├── PRD.md                # Product Requirements Document
│   ├── TRD.md                # Technical Requirements Document
│   └── UIUX.md               # UI/UX Design & Specification Document
├── client/                   # Next.js application root
│   ├── app/                  # Next.js App Router
│   │   ├── Landing/          # Landing page component
│   │   ├── api/              # API route handlers
│   │   ├── component/        # Shared UI components (Header, Footer, etc.)
│   │   ├── dashboard/        # Fleet overview & vehicle detail dynamic routes
│   │   │   └── [vehicleId]/  # Vehicle details & trip history table
│   │   ├── login/            # Authentication login page
│   │   ├── signup/           # Account registration page
│   │   └── map-test/         # Mappls Map SDK Proof-of-Concept
│   ├── database/             # Raw SQL schemas (users.sql)
│   ├── lib/                  # Utilities & 3rd-party integrations (Mappls SDK)
│   ├── mock/                 # Generated mock datasets (vehicles.json, trips.json)
│   ├── prisma/               # Prisma ORM schema (schema.prisma)
│   ├── scripts/              # Data generation scripts (generateMockData.ts)
│   ├── package.json          # Client dependencies and npm scripts
│   └── README.md             # Client-specific setup guide
└── readme.md                 # Project root README
```

---

## Getting Started

### Prerequisites
- **Node.js**: v20 or later recommended
- **npm**: v10 or later
- **Docker & Docker Compose** (optional, for containerized runs)

---

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/KalviumCommunity/SW2627-Fleet-Dashboard-Analytics.git
   cd SW2627-Fleet-Dashboard-Analytics/client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in `client/` (and/or `.env` in the root) using the template below:
   ```env
   # Database (PostgreSQL)
   DATABASE_URL="postgresql://user:password@localhost:5432/fleet_dashboard?schema=public"

   # Authentication
   AUTH_SECRET="your-auth-secret-key"
   AUTH_GOOGLE_ID="your-google-client-id"
   AUTH_GOOGLE_SECRET="your-google-client-secret"

   # Mappls (MapmyIndia) SDK
   MAPMYINDIA_API_KEY="your-mappls-api-key"
   MAPMYINDIA_CLIENT_ID="your-mappls-client-id"
   MAPMYINDIA_CLIENT_SECRET="your-mappls-client-secret"
   ```

4. **Initialize Prisma Schema & Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **(Optional) Generate or Re-seed Mock Data:**
   ```bash
   npm run generate:mock
   ```

6. **Start the Next.js Development Server:**
   ```bash
   npm run dev
   ```
   The dashboard will be running at [http://localhost:3000](http://localhost:3000).

---

### Running with Docker

You can run the entire application in a Docker container:

```bash
# From the project root
docker-compose up --build
```

The application will be accessible at `http://localhost:3000`.

---

## Available Scripts

Inside the `client/` directory:

| Command | Description |
|---|---|
| `npm run dev` | Starts the Next.js local development server |
| `npm run build` | Builds the production Next.js bundle |
| `npm run start` | Runs the production build server |
| `npm run lint` | Runs ESLint to check for code quality and syntax issues |
| `npm run generate:mock` | Generates 10,000 mock vehicles and 50,000 trips into `client/mock/` |
| `npx prisma studio` | Opens the visual database management UI for Prisma |
| `npx prisma db push` | Pushes the schema definition directly to the PostgreSQL database |

---

## Documentation

Detailed design documents and technical specifications are available in `/docs`:
- [PRD.md](docs/PRD.md) — Product Requirements Document (Goals, User Stories, Scope)
- [TRD.md](docs/TRD.md) — Technical Requirements Document (Architecture, Data Schemas, APIs)
- [UIUX.md](docs/UIUX.md) — UI/UX Design Specifications (Design Tokens, Screens, Flows)
- [Mappls Integration Guide](client/lib/mapmyindia/README.md) — Map SDK documentation and credential setup

---

## Contributing & Git Workflow

- The `main` branch is protected — direct pushes are disallowed.
- Create feature or documentation branches from `main`:
  ```bash
  git checkout -b feature/your-feature-name
  ```
- Commit atomic changes with clear commit messages.
- Open a Pull Request (PR) against `main` for team review.