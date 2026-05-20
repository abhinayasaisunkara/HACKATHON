# AGENTS.md

## Project: Wealth Operations Backend

### Description
Backend API service for the Wealth Operations & Compliance Workflow System. Built with Next.js 14 App Router, Supabase PostgreSQL, and JWT-based authentication with RBAC.

### Key Conventions
- All API routes live under `src/app/api/`
- Shared utilities (auth, supabase client, audit logger) live under `src/app/lib/`
- Every protected endpoint uses `requireAuth()` from `src/app/lib/auth.ts`
- RBAC is enforced at the route handler level by checking `payload.role`
- Supabase is accessed via a service-role admin client from `src/app/lib/supabase.ts`

### Database
- PostgreSQL via Supabase
- Tables: `users`, `roles`, `refresh_tokens`, `alerts`, `audit_logs`, `mf_transactions`, `mf_sips`, `investors`, `securities`

### Environment
- Runtime: Node.js 18+
- Port: 3002
- Environment variables stored in `.env.local`
