# Deploying Fleet Dashboard on Render

This guide provides step-by-step instructions for deploying the **SW2627 Fleet Dashboard Analytics** application as a full-stack service on [Render](https://render.com).

---

## Architecture Overview

The Fleet Dashboard is a full-stack Next.js (App Router) application that includes:
- **Frontend UI:** Responsive fleet tracking dashboard, detail pages with infinite scroll, and Mappls (MapmyIndia) live mapping.
- **Backend & APIs:** Next.js Route Handlers (`/api/fleet/vehicles`, `/api/mappls/token`, `/api/health`), Server Actions (`addVehicle`, `deleteVehicle`, `signOut`), and Supabase SSR session handling.
- **Database & Auth:** Supabase (Auth + Postgres + RLS) with optional Prisma integration.

Render can host this application either as a **Native Node.js Web Service** (recommended for fastest builds and native caching) or as a **Docker Web Service** (using the multi-stage Dockerfile).

---

## Prerequisites

1. A [GitHub](https://github.com) account containing this repository.
2. A [Render](https://render.com) account.
3. A [Supabase](https://supabase.com) project (for authentication and database).
4. A [Mappls](https://about.mappls.com/api/) developer key.

---

## Method 1: Blueprint Deployment via `render.yaml` (Recommended)

This repository includes a pre-configured `render.yaml` Blueprint specification for automated zero-config setup.

1. Go to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** and select **Blueprint**.
3. Connect your GitHub repository (`SW2627-Fleet-Dashboard-Analytics`).
4. Render will read `render.yaml` and discover the `fleet-dashboard` web service.
5. In the configuration screen, Render will prompt you for the required environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_MAPPLS_KEY`
   - `SERVICE_ROLE_KEY` *(Optional: needed for admin/seeding operations)*
   - `DATABASE_URL` *(Optional: needed if connecting directly via Prisma)*
6. Click **Apply**. Render will automatically build, test, and deploy the application.

---

## Method 2: Manual Web Service Setup (Native Node.js)

If you prefer to configure the service manually through the Render UI:

1. In your Render Dashboard, click **New +** > **Web Service**.
2. Select **Build and deploy from a Git repository** and pick your repo.
3. Configure the following service settings:
   - **Name:** `fleet-dashboard`
   - **Region:** Choose the region closest to your users (e.g. `Oregon`, `Frankfurt`, or `Singapore`)
   - **Branch:** `main` (or your deployment branch)
   - **Root Directory:** `client`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** `Free` or `Starter`
4. Expand **Advanced** and set:
   - **Health Check Path:** `/api/health`
5. In the **Environment Variables** section, add:

| Key | Example / Description | Required |
|---|---|---|
| `NODE_ENV` | `production` | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xyzcompany.supabase.co` | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_...` | Yes |
| `NEXT_PUBLIC_MAPPLS_KEY` | `plhbrlxwfo...` | Yes |
| `SERVICE_ROLE_KEY` | `eyJhbGci...` | Optional (Server/Admin) |
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` | Optional (Prisma) |

6. Click **Create Web Service**.

> **Note on Root Directory:** If you leave **Root Directory** blank (repository root), Render will use the root `package.json`, which automatically delegates `build` and `start` commands to the `client/` subdirectory.

---

## Method 3: Containerized Deployment (Docker)

To deploy using Docker on Render:

1. In Render Dashboard, click **New +** > **Web Service**.
2. Connect your Git repository.
3. Select **Docker** as the runtime environment:
   - **Dockerfile Path:** `./Dockerfile`
   - **Docker Context:** `.`
4. Render will build the multi-stage Docker image defined in the root `Dockerfile`.
5. Add the environment variables listed in the table above under the **Environment** tab.
6. Set **Health Check Path** to `/api/health`.
7. Click **Create Web Service**.

---

## Environment Variables Details

### Supabase Setup
1. In your Supabase Dashboard, navigate to **Project Settings** > **API**.
2. Copy **Project URL** into `NEXT_PUBLIC_SUPABASE_URL`.
3. Copy **anon / public key** into `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Copy **service_role key** (secret) into `SERVICE_ROLE_KEY`.

### Mappls Setup
1. In your [Mappls Developer Console](https://about.mappls.com/api/), generate a map key.
2. Set it as `NEXT_PUBLIC_MAPPLS_KEY` (or `NEXT_PUBLIC_MAPMYINDIA_API_KEY`).

---

## Database Seeding (Optional)

If you are setting up a fresh database and want to load sample vehicles and trip history:

1. On your local machine, ensure your `.env.local` contains the `SERVICE_ROLE_KEY` and `NEXT_PUBLIC_SUPABASE_URL`.
2. Generate mock data:
   ```bash
   npm run generate:mock
   ```
3. Seed Supabase tables:
   ```bash
   npm run seed:supabase
   ```
4. If using Prisma:
   ```bash
   npm run db:push
   ```

---

## Health Check & Verification

Once deployed, Render provides you with a public URL: `https://<service-name>.onrender.com`.

- **Health Check:** `https://<service-name>.onrender.com/api/health`
  Returns:
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-09-09T12:00:00.000Z",
    "uptime": 142.5,
    "service": "fleet-dashboard"
  }
  ```
- **Landing & Auth:** `https://<service-name>.onrender.com/login`
- **Dashboard:** `https://<service-name>.onrender.com/dashboard`

---

## Troubleshooting

- **404 on Static Assets (`_next/static`):**
  When using Docker standalone mode, ensure `.next/static` is copied into `.next/standalone/.next/static` and `public` into `.next/standalone/public`. The updated `Dockerfile` handles this automatically.
- **Port Binding:**
  Render automatically sets the `PORT` environment variable (typically `10000`). Next.js's standalone server and `next start` dynamically bind to `process.env.PORT || 3000`.
- **Environment Variables Missing during Build:**
  Next.js inlines `NEXT_PUBLIC_*` variables during compilation. Make sure to set these variables in the Render Dashboard before triggering the build.
- **Free Instance Spin-Down:**
  On Render's free tier, the web service spins down after 15 minutes of inactivity and takes ~30-50 seconds to wake up on the next request. For instant response times, upgrade to the Starter plan.
