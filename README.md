# Wealth Operations Backend

## Overview
This is the **Wealth Operations & Compliance Workflow System** backend, built with **Next.js 14** (App Router) and **Supabase** (PostgreSQL). It provides a secure, role-based API for managing mutual fund transactions, compliance alerts, and audit logging.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT (Access + Refresh Tokens)
- **Authorization**: Role-Based Access Control (RBAC)
- **Language**: TypeScript

## Roles (RBAC)
| Role | Description |
|------|-------------|
| `SUPER_ADMIN` | Full access to all endpoints |
| `COMPLIANCE_OFFICER` | Access to alerts, audit logs, and MF data |
| `OPERATOR` | Access to alerts and MF data |
| `VIEWER` | Read-only access to MF data |

## API Endpoints

### 1. Authentication (3)
| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | POST | `/api/auth/signup` | Create new user account |
| 2 | POST | `/api/auth/login` | Login and get JWT token |
| 3 | GET | `/api/auth/me` | Get current logged-in user info |

### 2. Audit Logs (3)
| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 4 | GET | `/api/audit/logs` | Get all audit logs (Admin only) |
| 5 | GET | `/api/audit/entity/:type/:id` | Get logs for specific entity |
| 6 | GET | `/api/audit/user/:userId` | Get logs for specific user |

### 3. Alerts (4)
| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 7 | GET | `/api/alerts` | Get all alerts |
| 8 | GET | `/api/alerts/unresolved/count` | Get count of unresolved alerts |
| 9 | POST | `/api/alerts` | Create a new alert |
| 10 | PUT | `/api/alerts/:id/acknowledge` | Mark alert as acknowledged |

### 4. Mutual Funds (4)
| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 11 | GET | `/api/mf/transactions` | Get all MF transactions |
| 12 | GET | `/api/mf/transactions/customer/:customerRef` | Get MF transactions by customer |
| 13 | GET | `/api/mf/funds/:customerRef` | Get customer's fund holdings |
| 14 | GET | `/api/mf/sips/:customerRef` | Get customer's active SIPs |

### 5. Utility (2)
| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 15 | GET | `/health` | Health check |
| 16 | ALL | `/*` | 404 handler for undefined routes |

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env.local` file:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
```

### Run Development Server
```bash
npm run dev
```
Server starts at `http://localhost:3002`

### Build for Production
```bash
npm run build
npm start
```

## Project Structure
```
src/
├── app/
│   ├── api/
│   │   ├── auth/        # Authentication endpoints
│   │   ├── audit/       # Audit log endpoints
│   │   ├── alerts/      # Alert management endpoints
│   │   ├── mf/          # Mutual fund endpoints
│   │   └── [...catchAll] # 404 handler
│   ├── health/          # Health check endpoint
│   └── lib/             # Shared utilities (auth, supabase, audit)
```
