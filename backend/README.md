# AgroSafe Travel — Backend API & Database

Node.js, TypeScript, Express, and Supabase (PostgreSQL) backend built according to the specifications in `design/ERD.png`, `Level 0 DFD.png`, `Level 1 DFD.png`, `CFD (Guest/Host/Warnings)`, and `Payment & Lifecycle Flow.png`.

---

## 🏗️ Architecture & Database Design

The PostgreSQL database maps directly to the 11 entities in `ERD.png`:

| Table | Entity | Description |
|---|---|---|
| `users` | `USER` | Guest, Host, and Admin accounts with encrypted password hashing |
| `farms` | `FARM` | Farmstay properties with spatial coordinates & host relations |
| `static_geo_reference` | `STATIC_GEO_REFERENCE` | Center coordinates for fallback spatial queries |
| `monthly_safe_matrix` | `MONTHLY_SAFE_MATRIX` | 12-month historical rainfall & soil stability base scores |
| `bookings` | `BOOKING` | Guest reservations with status machine (`Confirmed`, `Active`, `Completed`, `Cancelled`) |
| `payments` | `PAYMENT` | AgroSafe Escrow Vault isolating stay funds (`Held_In_Escrow`, `Released_To_Host`, `Refunded_To_Guest`) |
| `landslide_reports` | `LANDSLIDE_REPORT` | Citizen hazard photos classified with CNN inference scores |
| `warnings` | `WARNING` | Active disaster alerts (`Automated_CNN`, `Manual_Host`) with spatial impact blast radius |
| `payment_transaction_log` | `PAYMENT_TRANSACTION_LOG` | Financial ledger (`Charge`, `Payout`, `Refund`) with gateway references |
| `booking_status_log` | `BOOKING_STATUS_LOG` | Status change audit trail |
| `notification_log` | `NOTIFICATION_LOG` | Push, SMS, and Email emergency dispatch records |

---

## 🚀 Quickstart

### 1. Install Dependencies
```bash
cd ../AgroWeb-backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Supabase project credentials:
```ini
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret
```

### 3. Setup Supabase Database
1. Open your Supabase project dashboard → **SQL Editor**.
2. Run `supabase/schema.sql` to create all tables, indexes, constraints, and triggers.
3. Run `supabase/seed.sql` to populate initial test users, farms, monthly matrices, and warnings.

### 4. Run Development Server
```bash
npm run dev
# Server starts at http://localhost:5000
```

---

## 📡 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` — Register Guest or Host
- `POST /api/auth/login` — Sign in and receive Bearer JWT
- `GET /api/auth/me` — Current authenticated profile

### 🏡 Farmstays (`/api/farms`)
- `GET /api/farms` — Search & filter farms (state, district, category)
- `GET /api/farms/:slug` — Farm details by slug
- `POST /api/farms` — (Host) List new farm with auto-resolved fallback coordinates

### 📅 Bookings & Escrow (`/api/bookings`, `/api/escrow`)
- `POST /api/bookings` — Create booking & lock funds in Escrow Vault (`Held_In_Escrow`)
- `GET /api/bookings` — List user's active/completed bookings
- `GET /api/escrow` — Global Escrow Vault ledger
- `POST /api/escrow/:paymentId/release` — Release payout to host upon safe checkout
- `POST /api/escrow/:paymentId/refund` — 100% Emergency refund to guest upon hazard alert

### ⚠️ Disaster Warnings & Safety Query (`/api/warnings`, `/api/safety`, `/api/reports`)
- `POST /api/reports` — Upload landslide photo → CNN visual inference classification
- `GET /api/warnings` — Active disaster warning feed with epicenter & blast radius
- `POST /api/warnings/manual` — (Host) Broadcast emergency warning to nearby radius
- `GET /api/safety/matrix` — 12-month historical safety matrix heatmap for district
- `GET /api/safety/query` — Hybrid safety rating (Base Monthly Matrix + Active Danger Overrides)

### 🔔 Notifications (`/api/notifications`)
- `GET /api/notifications` — Multi-channel notification log (Push, SMS, Email)
- `PATCH /api/notifications/:id/read` — Mark notification read
- `POST /api/notifications/read-all` — Mark all read
