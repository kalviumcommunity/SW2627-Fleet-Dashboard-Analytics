# Fleet Dashboard — Client Application

The frontend and API layer for the **Fleet Management & Analytics Dashboard**, built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **Prisma ORM**, and **Mappls Web Maps SDK**.

---

## Features

- **Fleet Overview**: Responsive catalog rendering 10,000 vehicles with color-coded status badges.
- **Dynamic Vehicle Details**: Route `/dashboard/[vehicleId]` for per-vehicle metadata, GPS points, and trip logs.
- **Mappls Vector Maps**: Interactive mapping via Mappls SDK for vehicle coordinate mapping.
- **PostgreSQL & Prisma ORM**: Relational user model, schema migrations, and role-based access control (`admin`, `user`).
- **Synthetic Data Generator**: Standalone script to synthesize 10,000 mock vehicles and 50,000 trip records.

---

## Getting Started

### 1. Prerequisites
- **Node.js**: v20 or later
- **npm**: v10 or later
- **PostgreSQL Database** (local instance or cloud database like Supabase / Neon / Cloud SQL)

---

### 2. Installation

Install all required dependencies:

```bash
npm install
```

---

### 3. Environment Variables

Create a `.env.local` file inside the `client/` directory:

```env
# PostgreSQL Connection String
DATABASE_URL="postgresql://username:password@localhost:5432/fleet_dashboard?schema=public"

# Auth.js / NextAuth Configuration
AUTH_SECRET="your-auth-secret-string"
AUTH_GOOGLE_ID="your-google-oauth-client-id"
AUTH_GOOGLE_SECRET="your-google-oauth-client-secret"

# Mappls (MapmyIndia) SDK Keys
MAPMYINDIA_API_KEY="your-mappls-api-key"
MAPMYINDIA_CLIENT_ID="your-mappls-client-id"
MAPMYINDIA_CLIENT_SECRET="your-mappls-client-secret"
```

> **Security Warning:** Never commit `.env.local` or private keys to the repository.

---

### 4. Database Setup (Prisma ORM)

Generate the Prisma Client and synchronize the database schema:

```bash
# Generate Prisma client bindings
npx prisma generate

# Push schema directly to your PostgreSQL database
npx prisma db push

# (Optional) Open Prisma Studio visual GUI
npx prisma studio
```

---

### 5. Mock Data Generation

To generate or refresh the mock dataset (10,000 vehicles and 50,000 trips):

```bash
npm run generate:mock
```

This will write generated data files into:
- `mock/vehicles.json`
- `mock/trips.json`

---

### 6. Development Server

Start the local Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Runs the Next.js development server on port 3000 |
| `npm run build` | Compiles and optimizes the Next.js application for production |
| `npm run start` | Runs the compiled Next.js production server |
| `npm run lint` | Runs ESLint checks across the codebase |
| `npm run generate:mock` | Generates 10,000 synthetic vehicles and 50,000 trips using `tsx` |

---

## Directory Structure

```
client/
├── app/                      # Next.js App Router
│   ├── Landing/              # Landing page component
│   ├── api/                  # Backend API routes
│   ├── component/            # Shared UI components (Header, Footer)
│   ├── dashboard/            # Fleet overview page
│   │   └── [vehicleId]/      # Dynamic vehicle detail & trip logs
│   ├── login/                # Login authentication page
│   ├── signup/               # Account signup page
│   ├── map-test/             # Mappls Vector Maps SDK POC
│   ├── globals.css           # Global Tailwind CSS imports
│   ├── layout.tsx            # Root layout wrapper
│   └── page.tsx              # Root landing page router
├── database/                 # SQL schemas (users.sql)
├── lib/                      # Integration wrappers (Mappls SDK)
├── mock/                     # Generated mock JSON datasets
├── prisma/                   # Prisma ORM schema (schema.prisma)
├── scripts/                  # Data generator scripts (generateMockData.ts)
├── package.json              # Dependencies and script definitions
└── tsconfig.json             # TypeScript compiler configuration
```
